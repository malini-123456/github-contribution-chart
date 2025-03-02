import { useEffect, useState } from "react";
import "./App.css";
import HeatmapCalender from "./components/HeatmapCalender";
import fetchYearlyContributions from "./components/API/api";
import { Header } from "./components/Header";
import { Input } from "./components/Input";
import themes from "./components/Theme/themes";
import loadingGif from "../src/assets/images/loading.gif";
import logo from "../src/assets/images/logo.png";

import SelectThemes from "./components/SelectTheme";

function App() {
  const [username, setUsername] = useState("");
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [themeName, setThemeName] = useState("GitHub");
  const [selectedTheme, setSelectedTheme] = useState("");

  const handleFetchData = async () => {
    setLoading(true);
    setError("");
    setContributions([]);
    try {
      const data = await fetchYearlyContributions(username);
      setContributions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectedTheme = themes.find((theme) => theme.name === themeName);
    setSelectedTheme(selectedTheme);
  }, [themeName]);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen w-full bg-[#202c37] px-4 font-poppins">
        <div id="image" className="mx-auto max-w-40 pt-10 sm:max-w-56">
          <img src={logo} alt="website logo" className="w-full" />
        </div>
        <h1 className="pb-10 text-center text-2xl font-semibold text-white sm:text-4xl">
          GitHub Contribution Chart Generator
        </h1>
        <div className="flex justify-center sm:mx-auto sm:max-w-md">
          <Input
            className="min-w min-w-40 flex-grow rounded-l-lg border p-2 outline-none"
            type="text"
            placeholder="Your GitHub Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button
            type="submit"
            className="flex flex-nowrap items-center rounded-r-lg bg-green-500 px-3 py-2 text-white hover:bg-green-600 sm:px-4"
            onClick={handleFetchData}
            disabled={!username}
          >
            <span className="pr-1">✨</span>Generate!
          </button>
        </div>

        <SelectThemes themeName={themeName} setThemeName={setThemeName} />

        {contributions.length !== 0 && (
          <p className="pb-3 pt-10 text-center text-white">
            Your Chart is Ready 😃
          </p>
        )}

        {loading && (
          <div className="pt-8 text-center">
            <img
              className="mx-auto max-w-52"
              src={loadingGif}
              alt="loading gif"
            />
            <p className="pt-4 text-gray-300">
              Please wait, I'm visiting your profile . . .
            </p>
          </div>
        )}
        {error && (
          <p className="py-10 text-center text-gray-300">
            Could not find your profile
          </p>
        )}

        <div className="mx-auto flex max-w-screen-xl items-start justify-start overflow-x-auto pt-8 lg:justify-center">
          <HeatmapCalender data={contributions} selectedTheme={selectedTheme} />
        </div>
      </main>
      {contributions.length !== 0 && (
        <footer className="bg-[#202c37] py-8 text-center font-poppins">
          <p className="text-white">Made with ❤️ by Nikhil Singh</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              type="button"
              className="flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              🔗 Copy
            </button>
            <button
              type="button"
              className="flex items-center rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              ⬇️ Download
            </button>
          </div>
        </footer>
      )}
    </>
  );
}

export default App;
