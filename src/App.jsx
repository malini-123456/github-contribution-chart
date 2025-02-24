import { useState } from "react";
import "./App.css";
import HeatmapCalender from "./components/HeatmapCalender";
import fetchYearlyContributions from "./components/API/api";
import { Header } from "./components/Header";
import { Input } from "./components/Input";

import dummyData from "./components/API/dummy-data";
import SelectThemes from "./components/SelectTheme";

function App() {
  const [username, setUsername] = useState("");
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchYearlyContributions(username);
      setContributions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto w-full bg-[#202c37] px-4 font-poppins">
        <h1 className="py-10 text-center text-4xl font-semibold text-white">
          GitHub Contribution Chart Generator
        </h1>
        <div className="mx-auto flex max-w-md justify-center">
          <Input
            className="flex-grow rounded-l-lg border p-2 outline-none"
            type="text"
            placeholder="Your GitHub Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button
            className="rounded-r-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            onClick={handleFetchData}
            disabled={!username}
          >
            Generate
          </button>
        </div>

        <SelectThemes />

        {contributions.length !== 0 && (
          <p className="pb-3 pt-10 text-center text-white">
            Your Chart is Ready 😃
          </p>
        )}

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="mx-auto flex max-w-screen-xl items-start justify-start overflow-x-auto pt-8 lg:justify-center">
          <HeatmapCalender data={contributions} />
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
              🔗 Share
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
