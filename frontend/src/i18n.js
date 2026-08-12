import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "rice-disease-ui-language";

const STRINGS = {
    en: {
        appName: "Rice Disease Detection",
        languageSwitch: "ने",
        nav: {
            scan: "Scan a Leaf",
            weather: "Weather",
            library: "Disease Library",
        },
        scanner: {
            kicker: "AI Diagnostic Tool",
            title: "Scan a rice leaf",
            description:
                "Upload or photograph a single leaf and the model identifies the likely disease, its confidence, and — via Grad-CAM — exactly which part of the leaf it looked at.",
            dropTitle: "Drop a leaf photo here",
            dropSubtitle: "or choose one of the options below · JPG or PNG",
            browse: "Browse files",
            takePhoto: "Take photo",
            noImage: "No image selected yet",
            analyze: "Analyze leaf",
            analyzing: "Analyzing…",
            startOver: "Start over",
            predictedCondition: "Predicted condition",
            seeLess: "See less",
            seeMore: "See more",
            overlay: "Grad-CAM overlay",
            heatmap: "Raw heatmap",
            heatmapCaption: "Brighter regions influenced the prediction most",
            confidence: "Confidence",
            breakdown: "Full breakdown",
            lowConfidence:
                "The model isn't very confident about this one — the photo may be unclear, or it might not be a rice leaf at all. Treat this result as a rough guess.",
            selectImage: "Please choose an image file (JPG or PNG).",
            analysisFailed: "Could not analyze this image: {message}. Is the backend running?",
            confidenceHelp:
                "This result is uncertain. Try a clearer close-up of a single leaf.",
        },
        weather: {
            kicker: "7-Day Forecast",
            search: "Search a district or city",
            loading: "Loading forecast…",
            today: "Today",
            humidity: "humidity",
            wind: "km/h wind",
            feels: "Feels",
            goodForHarvest: "Good for harvest work",
            holdOffSpraying: "Hold off spraying",
            highRisk: "High blast/blight risk",
            normalConditions: "Normal field conditions",
            advisoryPrefix: "Field advisory",
            locating: "Locating…",
            yourLocation: "Your location",
            rain: "rain",
        },
        library: {
            kicker: "Field Reference",
            title: "Disease Library",
            description:
                "Symptoms, favorable conditions, treatment options and short videos for the conditions this model can recognize.",
            back: "Back to library",
            symptoms: "Symptoms to look for",
            conditions: "Conditions that favor it",
            management: "Field management",
            pesticides: "Pesticides & treatments referenced",
            product: "Product",
            type: "Type",
            note: "Note",
            advisory:
                "Always confirm rates and local registration with an agricultural extension office before applying any product.",
            watch: "Watch",
            category: {
                All: "All",
                Fungal: "Fungal",
                Bacterial: "Bacterial",
                Viral: "Viral",
                Pest: "Pest",
                Healthy: "Healthy",
            },
            risk: {
                High: "High risk",
                Moderate: "Moderate risk",
                None: "No risk",
                "Seed-borne": "Seed-borne risk",
            },
        },
    },
    ne: {
        appName: "धान रोग पहिचान",
        languageSwitch: "EN",
        nav: {
            scan: "पात स्क्यान",
            weather: "मौसम",
            library: "रोग सूची",
        },
        scanner: {
            kicker: "एआई जाँच उपकरण",
            title: "धानको पात स्क्यान गर्नुहोस्",
            description:
                "एउटा पातको फोटो अपलोड वा खिच्नुहोस्, र मोडेलले सम्भावित रोग, यसको विश्वास स्तर, र Grad-CAM मार्फत कुन भाग हेरेको थियो भनेर देखाउँछ।",
            dropTitle: "यहाँ पातको फोटो छोड्नुहोस्",
            dropSubtitle: "वा तलका विकल्पमध्ये एउटा छान्नुहोस् · JPG वा PNG",
            browse: "फाइल छान्नुहोस्",
            takePhoto: "फोटो खिच्नुहोस्",
            noImage: "अहिलेसम्म कुनै फोटो चयन गरिएको छैन",
            analyze: "पात जाँच्नुहोस्",
            analyzing: "जाँच हुँदै…",
            startOver: "फेरि सुरु गर्नुहोस्",
            predictedCondition: "अनुमानित अवस्था",
            seeLess: "कम देखाउनुहोस्",
            seeMore: "थप देखाउनुहोस्",
            overlay: "Grad-CAM ओभरले",
            heatmap: "कच्चा तातो नक्सा",
            heatmapCaption: "उज्यालो क्षेत्रले भविष्यवाणीमा बढी असर गर्‍यो",
            confidence: "विश्वास स्तर",
            breakdown: "पूरा विवरण",
            lowConfidence:
                "यो नतिजामा मोडेल धेरै विश्वस्त छैन — फोटो अस्पष्ट हुन सक्छ, वा यो धानको पात नै नहुन सक्छ। यसलाई करिब अनुमान मात्र मान्नुहोस्।",
            selectImage: "कृपया एउटा छवि फाइल छान्नुहोस् (JPG वा PNG)।",
            analysisFailed: "यो फोटो जाँच्न सकिएन: {message}. के backend चलिरहेको छ?",
            confidenceHelp:
                "यो नतिजा निश्चित छैन। एउटै पातको अझ स्पष्ट नजिकबाट खिचिएको फोटो प्रयोग गर्नुहोस्।",
        },
        weather: {
            kicker: "७-दिने पूर्वानुमान",
            search: "जिल्ला वा सहर खोज्नुहोस्",
            loading: "पूर्वानुमान लोड हुँदै…",
            today: "आज",
            humidity: "आर्द्रता",
            wind: "किमी/घण्टा हावा",
            feels: "अनुभूति",
            goodForHarvest: "कटानीका लागि राम्रो",
            holdOffSpraying: "छर्कन रोक्नुहोस्",
            highRisk: "ब्लास्ट/ब्याक्टेरियल ब्लाइटको उच्च जोखिम",
            normalConditions: "सामान्य खेत अवस्था",
            advisoryPrefix: "खेत सल्लाह",
            locating: "स्थान पत्ता लगाउँदै…",
            yourLocation: "तपाईंको स्थान",
            rain: "वर्षा",
        },
        library: {
            kicker: "खेत सन्दर्भ",
            title: "रोग सूची",
            description:
                "यस मोडेलले चिन्न सक्ने अवस्थाका लागि लक्षण, अनुकूल अवस्था, उपचार विकल्प र छोटा भिडियोहरू।",
            back: "सूचीमा फर्कनुहोस्",
            symptoms: "हेर्नुपर्ने लक्षणहरू",
            conditions: "अनुकूल अवस्थाहरू",
            management: "खेत व्यवस्थापन",
            pesticides: "उल्लेखित विषादी र उपचार",
            product: "उत्पादन",
            type: "प्रकार",
            note: "टिप्पणी",
            advisory:
                "कुनै पनि उत्पादन प्रयोग गर्नु अघि दर र स्थानीय दर्ता कृषि प्राविधिक कार्यालयबाट पुष्टि गर्नुहोस्।",
            watch: "हेर्नुहोस्",
            category: {
                All: "सबै",
                Fungal: "फफूँदीजन्य",
                Bacterial: "ब्याक्टेरियल",
                Viral: "भाइरल",
                Pest: "किरा",
                Healthy: "स्वस्थ",
            },
            risk: {
                High: "उच्च जोखिम",
                Moderate: "मध्यम जोखिम",
                None: "जोखिम छैन",
                "Seed-borne": "बिउबाट सर्ने जोखिम",
            },
        },
    },
};

const LanguageContext = createContext(null);

function resolvePath(source, key) {
    return key.split(".").reduce((value, part) => value?.[part], source);
}

function format(template, params) {
    return template.replace(/\{(\w+)\}/g, (_, token) => `${params?.[token] ?? ""}`);
}

export function getStoredLanguage() {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "ne" ? "ne" : "en";
}

export function translate(language, key, params) {
    const fallback = resolvePath(STRINGS.en, key);
    const localized = resolvePath(STRINGS[language] || STRINGS.en, key) ?? fallback;
    if (typeof localized !== "string") return fallback ?? key;
    return params ? format(localized, params) : localized;
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(getStoredLanguage);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, language);
        document.documentElement.lang = language === "ne" ? "ne" : "en";
    }, [language]);

    const value = useMemo(() => {
        const t = (key, params) => translate(language, key, params);
        return {
            language,
            isNepali: language === "ne",
            setLanguage,
            toggleLanguage: () => setLanguage((current) => (current === "en" ? "ne" : "en")),
            t,
        };
    }, [language]);

    return createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
