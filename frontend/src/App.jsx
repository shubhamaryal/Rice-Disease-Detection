import { Routes, Route } from "react-router-dom";
import Shell from "./components/Shell";
import Scanner from "./pages/Scanner";
import Weather from "./pages/Weather";
import DiseaseLibrary from "./pages/DiseaseLibrary";

export default function App() {
    return (
        <Routes>
            <Route element={<Shell />}>
                <Route path="/" element={<Scanner />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/library" element={<DiseaseLibrary />} />
            </Route>
        </Routes>
    );
}
