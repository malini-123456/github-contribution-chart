import React, { useState } from "react";

function ThemeList({ theme, themeName, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="theme"
        value={theme.name}
        checked={themeName === theme.name}
        onChange={onChange}
      />
      <div
        id="theme-image"
        className="flex h-[22px] w-[22px] flex-wrap items-center justify-center rounded-sm py-[2px]"
        style={{ backgroundColor: theme.background }}
      >
        <span
          className="inline-block h-[9px] w-[9px]"
          style={{ backgroundColor: theme.grade1 }}
        ></span>
        <span
          className="inline-block h-[9px] w-[9px]"
          style={{ backgroundColor: theme.grade2 }}
        ></span>
        <span
          className="inline-block h-[9px] w-[9px]"
          style={{ backgroundColor: theme.grade3 }}
        ></span>
        <span
          className="inline-block h-[9px] w-[9px]"
          style={{ backgroundColor: theme.grade4 }}
        ></span>
      </div>
      <p id="theme-name">{theme.name}</p>
    </label>
  );
}

export default ThemeList;
