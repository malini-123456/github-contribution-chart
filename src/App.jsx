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
import html2canvas from "html2canvas";

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

  const captureFullHeatmap = async () => {
    const element = document.querySelector("#canvas-container");
    if (!element) return;

    // Temporarily expand the container
    const originalOverflow = element.style.overflow;
    element.style.overflow = "visible";

    const canvas = await html2canvas(element, {
      scrollX: 0,
      scrollY: -window.scrollY, // Capture full content
      windowWidth: element.scrollWidth, // Full width
      windowHeight: element.scrollHeight, // Full height
      backgroundColor: `${selectedTheme.background}`,
    });

    // Restore original overflow after capture
    element.style.overflow = originalOverflow;

    return canvas;
  };

  // handle copy function
  const handleCopyToClipboard = async () => {
    try {
      const canvas = await captureFullHeatmap();
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      alert("Image copied to clipboard! 📋✨");
    } catch (error) {
      console.error("Error copying image:", error);
      alert("Failed to copy Image.");
    }
  };

  // handle download function
  const handleDownload = async () => {
    try {
      const canvas = await captureFullHeatmap();
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `${username}_contributions.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen w-full bg-[#202c37] px-4 font-poppins">
        <div id="image" className="mx-auto max-w-40 pt-10 sm:max-w-56">
          <img src={logo} alt="website logo" className="w-full" />
        </div>
        <h1 className="text-center text-2xl font-semibold text-white sm:text-4xl">
          GitHub Contribution Chart Generator
        </h1>
        <h4 className="pb-10 pt-4 text-center text-xl text-white">
          Generate your last one year contributions in one image!
        </h4>
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

        <div
          id="canvas-container"
          className="mx-auto flex max-w-screen-xl items-start justify-start overflow-x-auto rounded-md pb-4 pt-10 lg:justify-center"
          style={{
            backgroundColor:
              contributions.length != 0
                ? selectedTheme.background
                : "transparent",
          }}
        >
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
              onClick={handleCopyToClipboard}
            >
              🔗 Copy
            </button>
            <button
              type="button"
              className="flex items-center rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={handleDownload}
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
