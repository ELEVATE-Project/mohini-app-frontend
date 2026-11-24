import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FaPlus } from "react-icons/fa"
import { FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi"
import LanguageSelector from "./LanguageSelector"

export default function LoggedInChatSidebar({ userName, onNewChat, onProfile, onLogout }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const close = () => setIsOpen(false)

  const content = (
    <div className="flex flex-1 min-h-0 flex-col justify-between p-4">
      <div className="flex flex-col gap-4">
        <img src={t("pageLogo")} alt="shikshagraha" className="h-10 w-auto object-contain object-left" />
        <button
          type="button"
          onClick={() => {
            close()
            onNewChat()
          }}
          className="w-full h-11 rounded-xl text-white font-medium flex items-center justify-center gap-2"
          style={{ backgroundColor: "#572E91" }}
        >
          <FaPlus /> {t("newChat")}
        </button>
      </div>

      <div className="flex flex-col gap-3 w-full min-w-0">
        <div className="sidebar-lang-wrapper w-full min-w-0">
          <LanguageSelector fluid className="w-full" />
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <button type="button" onClick={onProfile} className="flex items-center gap-2 min-w-0">
            <FiUser className="text-2xl shrink-0" />
            <span className="truncate text-slate-700">{userName || "User"}</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="h-10 px-4 rounded-lg text-white text-sm flex items-center gap-2 shrink-0"
            style={{ backgroundColor: "#572E91" }}
          >
            <FiLogOut /> {t("logout")}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Web: always visible, takes space in the layout */}
      <aside className="hidden md:flex w-[260px] shrink-0 sticky top-0 h-screen flex-col overflow-x-hidden bg-white border-r border-slate-200">
        {content}
      </aside>

      {/* Mobile: menu button and overlay */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100"
        aria-label="Open menu"
      >
        <FiMenu className="text-xl" />
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <aside className="w-[80%] max-w-[300px] h-dvh overflow-x-hidden bg-white flex flex-col">
            <div className="flex justify-end p-3 pb-0 shrink-0">
              <button type="button" onClick={close} aria-label="Close menu">
                <FiX className="text-2xl" />
              </button>
            </div>
            {content}
          </aside>
          <div className="flex-1 bg-black/40" onClick={close} />
        </div>
      )}
    </>
  )
}