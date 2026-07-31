import { useEffect, useState } from "react";
import { MapPin, Search, Droplets, Wind, Loader2 } from "lucide-react";
import {
    fetchForecast,
    reverseGeocode,
    searchPlace,
    describeCode,
} from "../api/weather";
import WeatherIcon from "../components/WeatherIcon";

const DEFAULT_LOCATION = {
    name: "Kathmandu",
    latitude: 27.7172,
    longitude: 85.324,
};

function dayLabel(dateStr, index) {
    if (index === 0) return "Today";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: "short" });
}

// A rough, transparent heuristic -- not agronomic advice from a model,
// just plain rules a field advisor would apply from the same numbers.
function fieldAdvisory(day) {
    if (day.precipitation_probability_max >= 60) {
        return { label: "Hold off spraying", tone: "rust" };
    }
    if (day.relative_humidity_2m_max >= 85) {
        return { label: "High blast/blight risk", tone: "husk" };
    }
    if (
        day.precipitation_probability_max <= 20 &&
        day.wind_speed_10m_max < 20
    ) {
        return { label: "Good for harvest work", tone: "leaf" };
    }
    return { label: "Normal field conditions", tone: "leaf" };
}

export default function Weather() {
    const [location, setLocation] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(DEFAULT_LOCATION);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const name =
                    (await reverseGeocode(latitude, longitude)) ||
                    "Your location";
                setLocation({ name, latitude, longitude });
            },
            () => setLocation(DEFAULT_LOCATION),
            { timeout: 6000 },
        );
    }, []);

    useEffect(() => {
        if (!location) return;
        setLoading(true);
        setError("");
        fetchForecast(location.latitude, location.longitude)
            .then(setForecast)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [location]);

    const runSearch = async (q) => {
        setQuery(q);
        if (q.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        setSearching(true);
        try {
            const results = await searchPlace(q);
            setSuggestions(results);
        } catch {
            setSuggestions([]);
        } finally {
            setSearching(false);
        }
    };

    const pickPlace = (place) => {
        setLocation({
            name: [place.name, place.admin1, place.country]
                .filter(Boolean)
                .slice(0, 2)
                .join(", "),
            latitude: place.latitude,
            longitude: place.longitude,
        });
        setQuery("");
        setSuggestions([]);
    };

    const current = forecast?.current;
    const daily = forecast?.daily;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                    <div className="font-mono text-xs tracking-[0.14em] uppercase text-leaf-600">
                        7-Day Forecast
                    </div>
                    <h1 className="font-display font-semibold text-3xl sm:text-4xl text-leaf-900 mt-1 flex items-center gap-2">
                        <MapPin size={26} className="text-husk-500" />
                        {location?.name || "Locating…"}
                    </h1>
                    <p className="text-ink-600 mt-2 max-w-xl">
                        Plan spraying, drainage and harvest days around the week
                        ahead.
                    </p>
                </div>

                <div className="relative w-full sm:w-72">
                    <div className="flex items-center gap-2 bg-paper border border-paddy-200 rounded-full px-3.5 py-2">
                        <Search size={16} className="text-ink-400" />
                        <input
                            value={query}
                            onChange={(e) => runSearch(e.target.value)}
                            placeholder="Search a district or city"
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
                        />
                        {searching && (
                            <Loader2
                                size={14}
                                className="animate-spin text-ink-400"
                            />
                        )}
                    </div>
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full bg-paper border border-paddy-200 rounded-xl shadow-lg overflow-hidden">
                            {suggestions.map((s) => (
                                <li key={`${s.id}`}>
                                    <button
                                        onClick={() => pickPlace(s)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-paddy-50"
                                    >
                                        {s.name}
                                        <span className="text-ink-400">
                                            {s.admin1 ? `, ${s.admin1}` : ""},{" "}
                                            {s.country}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-rust-100 text-rust-500 px-4 py-3 text-sm mb-6">
                    {error}
                </div>
            )}

            {loading && (
                <div className="flex items-center gap-2 text-ink-600 font-mono text-sm">
                    <Loader2 size={16} className="animate-spin" /> Loading
                    forecast…
                </div>
            )}

            {!loading && current && (
                <div className="bg-leaf-700 text-paddy-50 rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <WeatherIcon
                            bucket={describeCode(current.weather_code).bucket}
                            size={48}
                        />
                        <div>
                            <div className="font-display text-4xl font-semibold leading-none">
                                {Math.round(current.temperature_2m)}°C
                            </div>
                            <div className="text-paddy-100 text-sm mt-1">
                                {describeCode(current.weather_code).label} ·
                                Feels {Math.round(current.apparent_temperature)}
                                °C
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-1.5">
                            <Droplets size={16} className="text-husk-400" />
                            {current.relative_humidity_2m}% humidity
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Wind size={16} className="text-husk-400" />
                            {Math.round(current.wind_speed_10m)} km/h
                        </div>
                    </div>
                </div>
            )}

            {!loading && daily && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {daily.time.map((date, i) => {
                        const advisory = fieldAdvisory({
                            precipitation_probability_max:
                                daily.precipitation_probability_max[i],
                            relative_humidity_2m_max:
                                daily.relative_humidity_2m_max[i],
                            wind_speed_10m_max: daily.wind_speed_10m_max[i],
                        });
                        const toneClasses =
                            advisory.tone === "rust"
                                ? "bg-rust-100 text-rust-500"
                                : advisory.tone === "husk"
                                  ? "bg-husk-100 text-husk-600"
                                  : "bg-paddy-100 text-leaf-700";
                        return (
                            <div
                                key={date}
                                className="bg-paper border border-paddy-200 rounded-2xl p-4 flex flex-col gap-2"
                            >
                                <div className="font-semibold text-ink-900">
                                    {dayLabel(date, i)}
                                </div>
                                <WeatherIcon
                                    bucket={
                                        describeCode(daily.weather_code[i])
                                            .bucket
                                    }
                                    size={30}
                                />
                                <div className="text-sm text-ink-600">
                                    {describeCode(daily.weather_code[i]).label}
                                </div>
                                <div className="font-mono text-sm">
                                    <span className="font-semibold text-leaf-900">
                                        {Math.round(
                                            daily.temperature_2m_max[i],
                                        )}
                                        °
                                    </span>{" "}
                                    <span className="text-ink-400">
                                        {Math.round(
                                            daily.temperature_2m_min[i],
                                        )}
                                        °
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-ink-600">
                                    <Droplets size={13} />
                                    {daily.precipitation_probability_max[i]}%
                                    rain
                                </div>
                                <span
                                    className={`mt-1 self-start text-[11px] font-medium px-2 py-1 rounded-full ${toneClasses}`}
                                >
                                    {advisory.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="font-mono text-[11px] text-ink-400 mt-8">
                Forecast data: Open-Meteo. Field advisories are simple rules of
                thumb from the numbers above -- always confirm with a local
                agronomist before a big spray or harvest decision.
            </p>
        </div>
    );
}
