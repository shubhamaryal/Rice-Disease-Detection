// Open-Meteo is free, requires no API key, and has generous rate limits --
// a good fit for a tool farmers will open repeatedly in the field.
// Docs: https://open-meteo.com/en/docs

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_GEOCODE_URL =
    "https://api.bigdatacloud.net/data/reverse-geocode-client";

// WMO weather codes -> short label + a simple condition bucket used to
// pick an icon and to drive the "good day to spray / harvest" advisory.
export const WEATHER_CODES = {
    0: { label: "Clear sky", bucket: "clear" },
    1: { label: "Mostly clear", bucket: "clear" },
    2: { label: "Partly cloudy", bucket: "cloud" },
    3: { label: "Overcast", bucket: "cloud" },
    45: { label: "Fog", bucket: "fog" },
    48: { label: "Depositing rime fog", bucket: "fog" },
    51: { label: "Light drizzle", bucket: "rain" },
    53: { label: "Drizzle", bucket: "rain" },
    55: { label: "Dense drizzle", bucket: "rain" },
    56: { label: "Freezing drizzle", bucket: "rain" },
    57: { label: "Freezing drizzle", bucket: "rain" },
    61: { label: "Light rain", bucket: "rain" },
    63: { label: "Rain", bucket: "rain" },
    65: { label: "Heavy rain", bucket: "storm" },
    66: { label: "Freezing rain", bucket: "rain" },
    67: { label: "Freezing rain", bucket: "rain" },
    71: { label: "Light snow", bucket: "snow" },
    73: { label: "Snow", bucket: "snow" },
    75: { label: "Heavy snow", bucket: "snow" },
    77: { label: "Snow grains", bucket: "snow" },
    80: { label: "Light showers", bucket: "rain" },
    81: { label: "Showers", bucket: "rain" },
    82: { label: "Violent showers", bucket: "storm" },
    85: { label: "Snow showers", bucket: "snow" },
    86: { label: "Snow showers", bucket: "snow" },
    95: { label: "Thunderstorm", bucket: "storm" },
    96: { label: "Thunderstorm, hail", bucket: "storm" },
    99: { label: "Thunderstorm, hail", bucket: "storm" },
};

export function describeCode(code) {
    return WEATHER_CODES[code] || { label: "Unknown", bucket: "cloud" };
}

export async function reverseGeocode(latitude, longitude) {
    try {
        const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        return (
            data.city ||
            data.locality ||
            data.principalSubdivision ||
            data.countryName ||
            null
        );
    } catch {
        return null;
    }
}

export async function searchPlace(query) {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Could not search for that place.");
    const data = await res.json();
    return data.results || [];
}

export async function fetchForecast(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        timezone: "auto",
        current:
            "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_max",
        forecast_days: "7",
    });

    const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Could not load the weather forecast.");
    return res.json();
}
