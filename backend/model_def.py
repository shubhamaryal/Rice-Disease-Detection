"""
RiceDiseaseNet-BIO model architecture.

This is a direct copy of the architecture defined in the training notebook
(RiceDiseaseNet-BIO-updated.ipynb). It has to match EXACTLY, otherwise the
saved weights (best_model.pth) will not load correctly.
"""
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F


class DepthwiseSeparableConv(nn.Module):
    def __init__(self, in_ch, out_ch, k=3, s=1, p=1):
        super().__init__()
        self.dw = nn.Conv2d(in_ch, in_ch, k, s, p, groups=in_ch, bias=False)
        self.pw = nn.Conv2d(in_ch, out_ch, 1, bias=False)
        self.bn = nn.BatchNorm2d(out_ch)
        self.act = nn.SiLU(inplace=True)

    def forward(self, x):
        return self.act(self.bn(self.pw(self.dw(x))))


class SqueezeExcitation(nn.Module):
    def __init__(self, ch, r=4):
        super().__init__()
        red = max(ch // r, 8)
        self.pool = nn.AdaptiveAvgPool2d(1)
        self.fc = nn.Sequential(
            nn.Linear(ch, red, bias=False), nn.SiLU(True),
            nn.Linear(red, ch, bias=False), nn.Sigmoid()
        )

    def forward(self, x):
        b, c, _, _ = x.size()
        return x * self.fc(self.pool(x).view(b, c)).view(b, c, 1, 1)


class SwarmAttention(nn.Module):
    def __init__(self, ch, n_agents=8):
        super().__init__()
        self.pheromone = nn.Parameter(torch.ones(1, ch, 1, 1))
        self.agents = nn.ModuleList([
            nn.Sequential(nn.Conv2d(ch, ch // n_agents, 1, bias=False),
                          nn.BatchNorm2d(ch // n_agents), nn.SiLU(True))
            for _ in range(n_agents)
        ])
        self.agg = nn.Conv2d(ch, ch, 1, bias=False)
        self.gamma = nn.Parameter(torch.zeros(1))

    def forward(self, x):
        explored = torch.cat([a(x) for a in self.agents], dim=1)
        return x + self.gamma * self.agg(explored * torch.sigmoid(self.pheromone))


class ECABlock(nn.Module):
    def __init__(self, ch):
        super().__init__()
        k = int(abs((np.log2(ch) + 1) / 2)) | 1
        self.pool = nn.AdaptiveAvgPool2d(1)
        self.conv = nn.Conv1d(1, 1, k, padding=k // 2, bias=False)

    def forward(self, x):
        y = self.pool(x).squeeze(-1).transpose(-1, -2)
        return x * torch.sigmoid(self.conv(y).transpose(-1, -2).unsqueeze(-1))


class MultiScaleBlock(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        mid = out_ch // 4
        self.b1 = nn.Sequential(nn.Conv2d(in_ch, mid, 1, bias=False), nn.BatchNorm2d(mid), nn.SiLU(True))
        self.b3 = nn.Sequential(nn.Conv2d(in_ch, mid, 1, bias=False), DepthwiseSeparableConv(mid, mid, 3, p=1))
        self.b5 = nn.Sequential(nn.Conv2d(in_ch, mid, 1, bias=False), DepthwiseSeparableConv(mid, mid, 5, p=2))
        self.bp = nn.Sequential(nn.AvgPool2d(3, 1, 1), nn.Conv2d(in_ch, mid, 1, bias=False), nn.BatchNorm2d(mid), nn.SiLU(True))
        self.fuse = nn.Sequential(nn.Conv2d(mid * 4, out_ch, 1, bias=False), nn.BatchNorm2d(out_ch), nn.SiLU(True))

    def forward(self, x):
        return self.fuse(torch.cat([self.b1(x), self.b3(x), self.b5(x), self.bp(x)], 1))


class EvolutionaryFeatureBlock(nn.Module):
    def __init__(self, ch):
        super().__init__()
        self.importance = nn.Parameter(torch.ones(1, ch, 1, 1))
        self.refine = nn.Sequential(
            nn.Conv2d(ch, ch // 2, 1, bias=False), nn.BatchNorm2d(ch // 2), nn.SiLU(True),
            nn.Conv2d(ch // 2, ch, 1, bias=False), nn.Sigmoid()
        )

    def forward(self, x):
        return x * torch.sigmoid(self.importance) * self.refine(x)


class RiceDiseaseNetBIO(nn.Module):
    def __init__(self, num_classes=8, base=32):
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv2d(3, base, 3, 2, 1, bias=False), nn.BatchNorm2d(base), nn.SiLU(True),
            nn.Conv2d(base, base, 3, 1, 1, bias=False), nn.BatchNorm2d(base), nn.SiLU(True)
        )
        self.s1 = nn.Sequential(MultiScaleBlock(base, base * 2), SqueezeExcitation(base * 2), nn.MaxPool2d(2))
        self.s2 = nn.Sequential(MultiScaleBlock(base * 2, base * 4), SwarmAttention(base * 4), ECABlock(base * 4), nn.MaxPool2d(2))
        self.s3 = nn.Sequential(MultiScaleBlock(base * 4, base * 8), EvolutionaryFeatureBlock(base * 8), SwarmAttention(base * 8), nn.MaxPool2d(2))
        self.s4 = nn.Sequential(DepthwiseSeparableConv(base * 8, base * 16), EvolutionaryFeatureBlock(base * 16), ECABlock(base * 16))
        self.f2, self.f3, self.f4 = (
            nn.Conv2d(base * 4, base * 4, 1),
            nn.Conv2d(base * 8, base * 4, 1),
            nn.Conv2d(base * 16, base * 4, 1),
        )
        self.fuse = nn.Sequential(nn.Conv2d(base * 12, base * 8, 1, bias=False), nn.BatchNorm2d(base * 8), nn.SiLU(True))
        self.pool = nn.AdaptiveAvgPool2d(1)
        fc = base * 8
        self.h1 = nn.Linear(fc, num_classes)
        self.h2 = nn.Sequential(nn.Linear(fc, fc // 2), nn.SiLU(True), nn.Dropout(0.3), nn.Linear(fc // 2, num_classes))
        self.h3 = nn.Sequential(nn.Linear(fc, fc // 4), nn.SiLU(True), nn.Dropout(0.2), nn.Linear(fc // 4, num_classes))
        self.ew = nn.Parameter(torch.ones(3) / 3)
        self._init()

    def _init(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.trunc_normal_(m.weight, std=0.02)
                m.bias is not None and nn.init.zeros_(m.bias)

    def forward(self, x):
        x = self.stem(x)
        x1 = self.s1(x)
        x2 = self.s2(x1)
        x3 = self.s3(x2)
        x4 = self.s4(x3)
        sz = x4.shape[2:]
        fused = torch.cat([
            F.adaptive_avg_pool2d(self.f2(x2), sz),
            F.adaptive_avg_pool2d(self.f3(x3), sz),
            self.f4(x4)
        ], 1)
        feat = self.pool(self.fuse(fused)).flatten(1)
        w = F.softmax(self.ew, 0)
        return w[0] * self.h1(feat) + w[1] * self.h2(feat) + w[2] * self.h3(feat)


class GradCAM:
    """Grad-CAM on the last block of stage 4 (model.s4[-1]), matching the notebook."""

    def __init__(self, model, layer):
        self.model, self.grads, self.acts = model, None, None
        layer.register_forward_hook(lambda m, i, o: setattr(self, 'acts', o.detach()))
        layer.register_full_backward_hook(lambda m, gi, go: setattr(self, 'grads', go[0].detach()))

    def generate(self, x, cls=None):
        self.model.eval()
        out = self.model(x)
        if cls is None:
            cls = out.argmax(1)
        self.model.zero_grad()
        one_hot = torch.zeros_like(out)
        one_hot[0, cls] = 1
        out.backward(gradient=one_hot)
        weights = self.grads.mean(dim=(2, 3), keepdim=True)
        cam = F.relu((weights * self.acts).sum(1, keepdim=True))
        cam = (cam - cam.min()) / (cam.max() + 1e-8)
        return F.interpolate(cam, x.shape[2:], mode='bilinear', align_corners=False).squeeze().cpu().numpy(), out
