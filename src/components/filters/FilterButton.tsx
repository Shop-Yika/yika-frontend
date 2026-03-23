"use client";

import React from "react";

interface FilterButtonProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

export default function FilterButton({ showSidebar, setShowSidebar }: FilterButtonProps) {
  return (
    <div className="lg:hidden flex justify-center mt-2 px-4 mb-10">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`
          w-full
          h-[46px]
          bg-[#8c2d8b]
          border border-black/30
          flex items-center justify-center
          px-[20.5px] py-[15.4px] gap-[41px]
          font-['Satoshi']
          text-[17.94px]
          font-medium
          text-black
        `}
      >
        Filter & Sort
      </button>
    </div>
  );
}
