import React from "react";
import ThemeList from "./ThemeList";
import themes from "./Theme/themes";

function SelectThemes({ themeName, setThemeName }) {
  return (
    <div
      id="select-themes"
      className="mx-auto mt-12 max-w-4xl rounded-md border-2 border-gray-600 px-5 pb-5 text-center font-poppins text-gray-400"
    >
      <p className="relative -top-[14px] inline-block bg-[#202c37] px-1 font-medium">
        SELECT A THEME:
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-4 lg:gap-y-5">
        {themes.map((theme, index) => (
          <ThemeList
            theme={theme}
            key={index}
            themeName={themeName}
            onChange={(e) => setThemeName(e.target.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default SelectThemes;
