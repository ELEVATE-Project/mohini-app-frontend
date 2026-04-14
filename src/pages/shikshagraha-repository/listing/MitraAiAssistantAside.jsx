import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdMoreVert } from "react-icons/md";
import ROUTES from "../../../url";
import { rootPath } from "utils/constants";
import aiBookIcon from "../../../assets/hugeicons_ai-book.svg";

export default function MitraAiAssistantAside() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    const fullUrl = `${window.location.origin}${rootPath}${ROUTES.MITRA_CHAT}`;
    window.open(fullUrl, "_blank");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white 
                   w-14 h-14 rounded-full shadow-lg flex items-center 
                   justify-center hover:scale-105 transition-all"
      >
        <img src={aiBookIcon} alt="AI Book" className="w-8 h-8" />
      </button>

      {/* Floating Card */}
      {open && (
        <aside className="fixed bottom-24 right-6 z-50 w-72 bg-white px-3 py-3 md:px-4 md:py-6 
                          rounded-lg shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-bold leading-[28px]">
              {t("mitraAiAssistant")}
            </h3>
            <MdMoreVert className="w-5 h-5 text-[#9CA3AF]" />
          </div>

          <div className="h-[1px] border-t border-[#E5E7EB] my-2 md:my-4"></div>

          <div className="rounded-lg p-2 md:p-3 bg-[#F3F4F6]">
            <p className="font-normal text-xs leading-[16px] text-[#6B7280]">
              {t("generateMicroImprovementProjectsDescription")}
            </p>
          </div>

          <button
            onClick={handleClick}
            className="w-full p-2 flex justify-center items-center 
                       rounded-lg bg-[#2563EB] text-white mt-3 text-xs"
          >
            <span className="font-medium">
              {t("generateImprovementProjects")}
            </span>
          </button>
        </aside>
      )}
    </>
  );
}