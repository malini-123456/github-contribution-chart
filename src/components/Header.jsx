import React from "react";

export const Header = () => {
  return (
    <header className="w-full bg-[#2b3945] py-4 font-poppins text-white">
      <div
        id="header-content"
        className="mx-auto flex max-w-screen-xl justify-between px-4 font-medium"
      >
        <div id="logo" className="text-4xl">
          G<span className="text-blue-700">C2</span>G
        </div>
      </div>
    </header>
  );
};
