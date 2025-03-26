import { useEffect, useState } from "react";
import "./App.css";
import HeatmapCalender from "./components/HeatmapCalender";
import fetchYearlyContributions from "./components/API/api";
import { Input } from "./components/Input";
import themes from "./components/Theme/themes";
import loadingGif from "../src/assets/images/loading.gif";
import logo from "../src/assets/images/logo.png";
import SelectThemes from "./components/SelectTheme";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";

function App() {
  // State variables
  const [username, setUsername] = useState(""); // Stores the GitHub username entered by the user
  const [contributions, setContributions] = useState([]); // Stores the fetched contribution data
  const [loading, setLoading] = useState(false); // Indicates whether data is being fetched
  const [error, setError] = useState(""); // Stores any error messages
  const [themeName, setThemeName] = useState("GitHub"); // Stores the selected theme name
  const [selectedTheme, setSelectedTheme] = useState(""); // Stores the selected theme object

  // Toast notification for successful image copy
  const notify = () =>
    toast.success("Image Copied!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  // Fetch contribution data for the entered GitHub username
  const handleFetchData = async () => {
    setLoading(true); // Show loading indicator
    setError(""); // Clear previous errors
    setContributions([]); // Clear previous contributions
    try {
      const data = await fetchYearlyContributions(username); // Fetch data from API
      setContributions(data); // Update state with fetched data
    } catch (err) {
      setError(err.message); // Handle errors
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Update the selected theme whenever the theme name changes
  useEffect(() => {
    const selectedTheme = themes.find((theme) => theme.name === themeName);
    setSelectedTheme(selectedTheme);
  }, [themeName]);

  // Capture the full heatmap as a canvas
  const captureFullHeatmap = async () => {
    const element = document.querySelector("#canvas-container");
    if (!element) return;

    // Temporarily expand the container for full capture
    const originalOverflow = element.style.overflow;
    element.style.overflow = "visible";

    const canvas = await html2canvas(element, {
      scrollX: 0,
      scrollY: -window.scrollY, // Capture full content
      windowWidth: element.scrollWidth, // Full width
      windowHeight: element.scrollHeight, // Full height
      backgroundColor: `${selectedTheme.background}`, // Use selected theme background
    });

    // Restore original overflow after capture
    element.style.overflow = originalOverflow;

    return canvas;
  };

  // Copy the heatmap image to the clipboard
  const handleCopyToClipboard = async () => {
    try {
      const canvas = await captureFullHeatmap();
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      notify(); // Show success notification
    } catch (error) {
      console.error("Error copying image:", error);
      alert("Failed to copy Image."); // Show error alert
    }
  };

  // Download the heatmap image as a PNG file
  const handleDownload = async () => {
    try {
      const canvas = await captureFullHeatmap();
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `${username}_contributions.png`; // Set download filename
      link.click(); // Trigger download
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      {/* Main container */}
      <main className="mx-auto min-h-screen w-full bg-[#202c37] px-4 font-poppins">
        {/* Logo */}
        <div id="image" className="mx-auto max-w-40 pt-10 sm:max-w-56">
          <img src={logo} alt="website logo" className="w-full" />
        </div>

        {/* Title and description */}
        <h1 className="text-center text-2xl font-semibold text-white sm:text-4xl">
          GitHub Contribution Chart Generator
        </h1>
        <h4 className="pb-10 pt-4 text-center text-xs font-light text-white sm:text-lg">
          Generate your last one year contributions in one image!
        </h4>

        {/* Input field and generate button */}
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
            disabled={!username} // Disable button if username is empty
          >
            <span className="pr-1">✨</span>Generate!
          </button>
        </div>

        {/* Theme selection */}
        <SelectThemes themeName={themeName} setThemeName={setThemeName} />

        {/* Success message */}
        {contributions.length !== 0 && (
          <p className="pb-3 pt-10 text-center text-white">
            Your Chart is Ready 😃
          </p>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="pt-8 text-center">
            <img
              className="mx-auto max-w-52"
              src={loadingGif}
              alt="loading gif"
              loading="lazy"
            />
            <p className="pt-4 text-gray-300">
              Please wait, I'm visiting your profile . . .
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="py-10 text-center text-gray-300">
            Could not find your profile
          </p>
        )}

        {/* Heatmap container */}
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

        {/* Toast notifications */}
        <ToastContainer />
      </main>

      {/* Footer with copy and download buttons */}
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
