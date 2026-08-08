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
        name: "Healthy Rice Leaf",
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
        id: "leaf_blast",
        slug: "leaf-blast",
        name: "Leaf Blast",
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
        id: "leaf_scald",
        slug: "leaf-scald",
        name: "Leaf scald",
        latin: "Microdochium oryzae (Rhynchosporium oryzae)",
        category: "Fungal",
        risk: "Moderate",
        color: "husk",
        summary:
            "A fungal disease that enters through leaf tips and wounds, producing alternating light and dark zonate bands that make the leaf tip look scorched or 'scalded'.",
        symptoms: [
            "Zonate, alternating light-tan and dark-brown bands starting at the leaf tip or margin",
            "Affected areas dry out and look bleached or scorched from a distance",
            "Lesions can expand and merge, killing large sections of older leaves",
        ],
        conditions: [
            "High humidity with extended periods of leaf wetness",
            "Dense canopies and lodged (fallen-over) plants that trap moisture",
            "Excess nitrogen and continuous cropping without residue management",
        ],
        management: [
            "Use certified seed and resistant varieties where available",
            "Avoid excess nitrogen; split doses instead of one heavy application",
            "Remove and destroy infected stubble and straw after harvest",
            "Improve field drainage and avoid overly dense planting",
        ],
        pesticides: [
            {
                name: "Propiconazole",
                type: "Fungicide",
                note: "Foliar spray commonly used against leaf scald.",
            },
            {
                name: "Mancozeb",
                type: "Fungicide",
                note: "Protectant spray, often used preventively in humid seasons.",
            },
        ],
        video: {
            id: "kpa0cIyQZfA",
            title: "How Farmers Harvest Rice — A Step-by-Step Guide",
        },
    },
    {
        id: "narrow_brown_leaf_spot",
        slug: "narrow-brown-leaf-spot",
        name: "Narrow Brown Leaf Spot",
        latin: "Cercospora janseana (Sphaerulina oryzina)",
        category: "Fungal",
        risk: "Moderate",
        color: "husk",
        summary:
            "A fungal leaf spot that shows up as short, narrow reddish-brown streaks running parallel to the leaf veins. Usually a minor disease on its own, but heavy infection late in the season can accelerate leaf senescence and reduce grain fill.",
        symptoms: [
            "Short, narrow, linear reddish-brown to dark-brown lesions running parallel to the veins",
            "Lesions stay narrow rather than spreading into round or diamond shapes",
            "Heavily infected leaves turn yellow-brown and die back early",
        ],
        conditions: [
            "Warm, humid weather during later growth stages",
            "Potassium-deficient or otherwise nutrient-stressed soil",
            "Continuous rice cropping without variety rotation",
        ],
        management: [
            "Maintain balanced fertilization, particularly adequate potassium",
            "Rotate varieties and avoid continuous mono-cropping of susceptible cultivars",
            "Remove and destroy infected residue after harvest",
            "Apply fungicide only if infection is heavy and appears early in the season",
        ],
        pesticides: [
            {
                name: "Propiconazole",
                type: "Fungicide",
                note: "Effective foliar option if infection pressure is high.",
            },
            {
                name: "Azoxystrobin",
                type: "Fungicide",
                note: "Broad-spectrum option, often tank-mixed for leaf spot diseases.",
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
