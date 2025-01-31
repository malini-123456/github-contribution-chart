import { useState } from "react";
import "./App.css";
import HeatmapCalender from "./components/HeatmapCalender";
import fetchYearlyContributions from "./components/API/api";

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
      <input
        className="border border-gray-300 p-2"
        type="text"
        placeholder="Enter GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className="ml-2 cursor-pointer rounded-md bg-blue-500 p-2 text-white"
        onClick={handleFetchData}
        disabled={!username}
      >
        Fetch Contributions
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <HeatmapCalender data={contributions} />
      </div>
    </>
  );
}

export default App;
