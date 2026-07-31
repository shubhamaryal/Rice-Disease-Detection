import {
    Sun,
    Cloud,
    CloudRain,
    CloudFog,
    CloudSnow,
    CloudLightning,
} from "lucide-react";

const ICONS = {
    clear: Sun,
    cloud: Cloud,
    rain: CloudRain,
    fog: CloudFog,
    snow: CloudSnow,
    storm: CloudLightning,
};

export default function WeatherIcon({ bucket, size = 24 }) {
    const Icon = ICONS[bucket] || Cloud;
    return <Icon size={size} className="text-husk-400" strokeWidth={1.8} />;
}
