import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdMoreVert } from "react-icons/md";
import ROUTES from "../../../url";
import { rootPath } from "utils/constants";
import aiBookIcon from "../../../assets/hugeicons_ai-book.svg";
import { X } from "lucide-react";

export default function MitraAiAssistantAside({ defaultBottom = 90 }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(defaultBottom);
  const [isMobile, setIsMobile] = useState(false);

  const handleClick = () => {
    const fullUrl = `${window.location.origin}${rootPath}${ROUTES.MITRA_CHAT}`;
    window.open(fullUrl, "_blank");
  };

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("section.footer");
    if (!footer) return;

    const DEFAULT_BOTTOM = defaultBottom;
    const GAP = 16;

    const updateOffset = () => {
      const footerRect = footer.getBoundingClientRect();
      const visibleOverlap = window.innerHeight - footerRect.top;
      if (visibleOverlap <= 0) {
        setBottomOffset(DEFAULT_BOTTOM);
        return;
      }
      setBottomOffset(visibleOverlap + GAP);
    };

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed ${isMobile ? "right-4" : "right-10"} z-[9999] bg-[var(--listing-primary)] text-white border border-white ${isMobile ? "w-16 h-16" : "w-20 h-20"} rounded-full shadow-[0_18px_40px_rgba(0,0,0,0.45)] flex items-center justify-center hover:scale-105 transition-all`}
        style={{ bottom: `${bottomOffset + (isMobile ? 10 : 0)}px` }}
      >
        {open ? (
          <X className={`${isMobile ? "w-6 h-6" : "w-10 h-10"}`} />
        ) : (
          <img src={aiBookIcon} alt="AI Book" className={`${isMobile ? "w-7 h-7" : "w-10 h-10"}`} />
        )}
      </button>

      {/* Floating Card */}
      {open && (
        <aside
          className={`fixed ${isMobile ? "right-4" : "right-20"} z-[9999] ${isMobile ? "w-[calc(100vw-1.5rem)]" : "w-72"} bg-white px-3 py-3 md:px-4 md:py-6 rounded-lg shadow-2xl transition-all duration-300`}
          style={{ bottom: `${bottomOffset + 85 + (isMobile ? 20 : 0)}px` }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-bold leading-[28px]">
              {t("mitraAiAssistant")}
            </h3>
            <MdMoreVert className="w-5 h-5 text-[var(--listing-subdued-text)]" />
          </div>

          <div className="h-[1px] border-t border-[var(--listing-border)] my-2 md:my-4"></div>

          <div className="rounded-lg p-2 md:p-3 bg-[var(--listing-surface)]">
            <p className="font-normal text-xs leading-[16px] text-[var(--listing-muted-text)]">
              {t("generateMicroImprovementProjectsDescription")}
            </p>
          </div>

          <button
            onClick={handleClick}
            className="w-full p-2 flex justify-center items-center 
                       rounded-lg bg-[var(--listing-secondary)] text-white mt-3 text-xs"
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