// Reference content for the Disease Library page. Written in our own
// words from public agronomy references (IRRI Rice Knowledge Bank, ICAR,
// university extension services) -- not copied from any single source.
// This is general guidance, not a substitute for a local agricultural
// extension officer, who can confirm a diagnosis and recommend products
// registered for use in your district.

export const CATEGORIES = [
    "All",
    "Fungal",
    "Bacterial",
    "Viral",
    "Pest",
    "Healthy",
];

export const DISEASES = [
    {
        id: "healthy",
        slug: "healthy",
        name: "Healthy Leaf",
        latin: null,
        category: "Healthy",
        risk: "None",
        color: "leaf",
        summary:
            "No signs of disease or pest damage. Uniform green color and intact leaf blades from tip to sheath.",
        symptoms: [
            "Even green color across the whole leaf blade",
            "No lesions, spots, or discoloration",
            "Leaves stand upright, not wilted or curling",
        ],
        conditions: [
            "Balanced nitrogen, phosphorus and potassium",
            "Good field drainage and water management",
            "Routine scouting so early problems are caught before they spread",
        ],
        management: [
            "Keep monitoring weekly, especially after heavy rain",
            "Maintain balanced fertilization rather than heavy nitrogen doses",
            "Rotate varieties across seasons to avoid buildup of any single pathogen",
        ],
        pesticides: [],
        video: {
            id: "kpa0cIyQZfA",
            title: "How Farmers Harvest Rice — A Step-by-Step Guide",
        },
    },
    {
        id: "rice_blast",
        slug: "rice-blast",
        name: "Rice Blast",
        latin: "Magnaporthe oryzae (Pyricularia oryzae)",
        category: "Fungal",
        risk: "High",
        color: "rust",
        summary:
            "One of the most destructive rice diseases worldwide. It can attack leaves, collars, nodes, and the neck of the panicle, and can kill young seedlings outright.",
        symptoms: [
            "Diamond or spindle-shaped lesions with gray-white centers and brown borders",
            "Lesions can merge into large irregular patches on the leaf",
            "Neck blast causes the panicle to snap or fill poorly",
        ],
        conditions: [
            "High humidity (90%+) with prolonged leaf wetness",
            "Cool nights combined with warm days (around 25–28°C)",
            "Excess nitrogen fertilizer, especially applied all at once",
        ],
        management: [
            "Plant blast-resistant varieties where available",
            "Split nitrogen into smaller doses instead of one heavy application",
            "Remove infected straw and stubble after harvest to reduce carryover",
            "Avoid dense, poorly-drained nurseries",
        ],
        pesticides: [
            {
                name: "Tricyclazole",
                type: "Fungicide",
                note: "Common systemic option for blast; follow local label rates.",
            },
            {
                name: "Isoprothiolane",
                type: "Fungicide",
                note: "Often used at booting stage to protect the panicle.",
            },
            {
                name: "Propiconazole",
                type: "Fungicide",
                note: "Broad-spectrum triazole, used as a seed or foliar treatment.",
            },
        ],
        video: {
            id: "ZCsKmEXC4Y8",
            title: "Rice Blast Disease: Symptoms and Effective Management Strategies",
        },
    },
    {
        id: "brown_spot",
        slug: "brown-spot",
        name: "Brown Spot",
        latin: "Bipolaris oryzae (Cochliobolus miyabeanus)",
        category: "Fungal",
        risk: "Moderate",
        color: "husk",
        summary:
            "Often a sign of nutrient-poor or unflooded soil as much as a pure infection. Historically linked to the 1943 Bengal famine, when it struck already-stressed crops hard.",
        symptoms: [
            "Small oval, dark-brown spots with a lighter gray-brown center",
            "Spots on leaves, sheaths, glumes and grains",
            "Heavily spotted seeds may fail to germinate or produce weak seedlings",
        ],
        conditions: [
            "Nitrogen, potassium or phosphorus-deficient soil",
            "High humidity (86–100%) with leaves wet for 8+ hours",
            "Direct-seeded, drought-stressed, or unflooded fields",
        ],
        management: [
            "Improve soil fertility with balanced, split fertilization",
            "Use certified, disease-free seed",
            "Apply seed-treatment fungicides in fields with a history of brown spot",
            "Keep fields adequately flooded/irrigated to reduce stress",
        ],
        pesticides: [
            {
                name: "Propiconazole",
                type: "Fungicide",
                note: "Effective seed treatment and foliar spray.",
            },
            {
                name: "Azoxystrobin",
                type: "Fungicide",
                note: "Broad-spectrum, often tank-mixed for leaf spot diseases.",
            },
            {
                name: "Carbendazim",
                type: "Fungicide",
                note: "Commonly used seed treatment in South Asia.",
            },
        ],
        video: {
            id: "ZVzIfQMS5bs",
            title: "Bacterial Leaf Blight and Brown Spot Disease Management in Paddy",
        },
    },
    {
        id: "bacterial_leaf_blight",
        slug: "bacterial-leaf-blight",
        name: "Bacterial Leaf Blight",
        latin: "Xanthomonas oryzae pv. oryzae",
        category: "Bacterial",
        risk: "High",
        color: "rust",
        summary:
            "A vascular disease that can wilt and kill whole seedlings (kresek) or cause yellowing and drying from the leaf tip inward in older plants. Losses can reach 50–70% in susceptible varieties.",
        symptoms: [
            "Water-soaked yellow-to-white lesions starting at leaf margins or tips",
            "Lesions spread down the leaf blade, turning it straw-colored",
            "Whole seedlings can wilt and die under severe early infection (kresek)",
        ],
        conditions: [
            "High humidity (83–93%) with moderate temperatures (26–30°C)",
            "Heavy rain and strong wind, which spread bacteria between plants and through leaf wounds",
            "Excess nitrogen and dense planting",
        ],
        management: [
            "Use resistant varieties where available -- the most reliable control",
            "Avoid overhead irrigation and standing water splashing between plants",
            "Remove and destroy infected stubble and weed hosts after harvest",
            "Balance nitrogen; avoid heavy single doses",
        ],
        pesticides: [
            {
                name: "Copper oxychloride",
                type: "Bactericide",
                note: "Common copper-based spray for bacterial diseases.",
            },
            {
                name: "Streptocycline",
                type: "Bactericide/antibiotic",
                note: "Often combined with copper as a seed soak or spray.",
            },
            {
                name: "Kasugamycin",
                type: "Bactericide",
                note: "Used in some regions specifically for bacterial blight.",
            },
        ],
        video: {
            id: "uniBswqkjPY",
            title: "Bacterial Leaf Blight (BLB) Disease of Rice and Its Easy Management",
        },
    },
    {
        id: "sheath_blight",
        slug: "sheath-blight",
        name: "Sheath Blight",
        latin: "Rhizoctonia solani",
        category: "Fungal",
        risk: "Moderate",
        color: "husk",
        summary:
            "A soil-borne fungus that thrives in dense, heavily-fertilized canopies. Lesions start near the waterline and climb the plant, sometimes reaching the flag leaf and reducing grain fill.",
        symptoms: [
            "Irregular, greenish-gray lesions with a brown border near the water line",
            "Lesions climb the sheath and blade as the canopy closes",
            "Severe cases dry out and kill young tillers",
        ],
        conditions: [
            "Dense planting and heavy nitrogen, which close the canopy and trap humidity",
            "Warm, humid weather during tillering to heading",
            "Standing water that keeps the fungus in contact with the stem",
        ],
        management: [
            "Avoid overly dense spacing and excess nitrogen",
            "Drain fields periodically rather than keeping continuous deep water",
            "Remove floating sclerotia (fungal survival structures) skimmed from the water surface",
            "Apply fungicide at early symptom onset if the field has a history of the disease",
        ],
        pesticides: [
            {
                name: "Validamycin",
                type: "Fungicide",
                note: "Widely used specifically against Rhizoctonia solani.",
            },
            {
                name: "Hexaconazole",
                type: "Fungicide",
                note: "Triazole fungicide applied at early lesion onset.",
            },
            {
                name: "Propiconazole",
                type: "Fungicide",
                note: "Foliar spray timed to canopy closure.",
            },
        ],
        video: {
            id: "r9x33zkLdKA",
            title: "Safety Measures for Farm Workers Handling Pesticides",
        },
    },
    {
        id: "tungro",
        slug: "rice-tungro-virus",
        name: "Rice Tungro Virus",
        latin: "RTBV + RTSV (leafhopper-transmitted)",
        category: "Viral",
        risk: "High",
        color: "rust",
        summary:
            "A viral disease carried by the green leafhopper. It is not soil- or seed-borne -- control focuses on the insect vector rather than a spray on the plant itself.",
        symptoms: [
            "Yellow-to-orange discoloration starting at the leaf tip",
            "Stunted growth and reduced tillering",
            "Panicles that are small, sterile, or partly filled",
        ],
        conditions: [
            "Presence of green leafhopper populations nearby",
            "Overlapping crop seasons that let the vector move between fields",
            "Early infection (before tillering) causes the most severe yield loss",
        ],
        management: [
            "Plant tungro-resistant varieties",
            "Synchronize planting dates in an area to break the leafhopper's breeding cycle",
            "Remove and destroy infected plants (roguing) early in the season",
            "Control leafhopper populations rather than treating the virus directly",
        ],
        pesticides: [
            {
                name: "Imidacloprid",
                type: "Insecticide (vector control)",
                note: "Targets the green leafhopper that spreads the virus.",
            },
            {
                name: "Thiamethoxam",
                type: "Insecticide (vector control)",
                note: "Seed or nursery treatment against leafhoppers.",
            },
        ],
        video: {
            id: "d-r5UkiJ9zE",
            title: "Paano ang Gagawin sa Rice Tungro Virus (Tungro Field Guide)",
        },
    },
    {
        id: "hispa",
        slug: "rice-hispa",
        name: "Rice Hispa",
        latin: "Dicladispa armigera",
        category: "Pest",
        risk: "Moderate",
        color: "husk",
        summary:
            "A small blue-black beetle. Adults scrape the upper leaf surface and grubs mine inside the leaf, leaving pale, papery streaks that farmers often mistake for a fungal streak disease.",
        symptoms: [
            "White, parallel streaks running along the leaf veins",
            "Upper leaf surface scraped away, leaving a papery, translucent look",
            "Heavy infestations give whole fields a scorched, whitish appearance",
        ],
        conditions: [
            "Cloudy, overcast weather with intermittent rain",
            "Dense, lush, over-fertilized nurseries and young crops",
            "Grassy bunds nearby that shelter adult beetles",
        ],
        management: [
            "Clip and destroy severely damaged leaf tips early in an outbreak",
            "Drain fields briefly -- larvae inside leaf mines are sensitive to drying",
            "Keep bunds clear of grassy weeds that host adults between seasons",
            "Encourage natural predators; avoid unnecessary early-season insecticide sprays",
        ],
        pesticides: [
            {
                name: "Chlorpyrifos",
                type: "Insecticide",
                note: "Used for heavy infestations; check local restrictions.",
            },
            {
                name: "Fipronil",
                type: "Insecticide",
                note: "Effective against adults and larvae in the leaf mine.",
            },
        ],
        video: {
            id: "kpa0cIyQZfA",
            title: "How Farmers Harvest Rice — A Step-by-Step Guide",
        },
    },
    {
        id: "bakanae",
        slug: "bakanae-disease",
        name: "Bakanae Disease",
        latin: "Gibberella fujikuroi (Fusarium fujikuroi)",
        category: "Fungal",
        risk: "Seed-borne",
        color: "husk",
        summary:
            'Japanese for "foolish seedling" -- infected plants grow abnormally tall and thin because the fungus produces excess gibberellin, then usually die before maturity.',
        symptoms: [
            "Seedlings noticeably taller, thinner and paler green than healthy neighbors",
            "Roots that are stunted, discolored or rotted",
            "Surviving plants often die before heading, or produce empty panicles",
        ],
        conditions: [
            "Infected or poorly-treated seed lots",
            "Warm soil temperatures during nursery establishment",
            "Continuous cropping without seed treatment between seasons",
        ],
        management: [
            "Use certified, disease-free seed",
            "Hot-water seed treatment (around 52–54°C for 10–15 minutes) before sowing",
            "Rogue and remove abnormally tall seedlings from the nursery before transplanting",
            "Treat seed with a labeled fungicide where bakanae has occurred before",
        ],
        pesticides: [
            {
                name: "Carbendazim",
                type: "Fungicide (seed treatment)",
                note: "Common bakanae seed treatment.",
            },
            {
                name: "Trichoderma-based bio-fungicide",
                type: "Biological seed treatment",
                note: "Used as a lower-residue alternative in nurseries.",
            },
        ],
        video: {
            id: "kpa0cIyQZfA",
            title: "How Farmers Harvest Rice — A Step-by-Step Guide",
        },
    },
];

export function getDisease(slug) {
    return DISEASES.find((d) => d.slug === slug);
}
