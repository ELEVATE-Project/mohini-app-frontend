import { FaArrowRightLong } from "react-icons/fa6"
import { buildWrapperLoginUrl } from "../../auth/wrapperUrl"
import { useTranslation } from "react-i18next"


// Login / Continue as Guest buttons. Used on the language step and by LoginGate.
export default function LoginOptions({ flow, language, onContinueAsGuest }) {

  const { t } = useTranslation()

  const handleLogin = () => {
    window.location.href = buildWrapperLoginUrl({ flow, preferredLanguage: language })
  }

  return (
    <div className="flex flex-col gap-4 w-full md:max-w-[420px] md:mx-auto">
      <button
        type="button"
        onClick={handleLogin}
        className="w-full h-14 rounded-xl text-white text-lg font-medium flex items-center justify-center"
        style={{ backgroundColor: "#572E91" }}
      >
        {t("login")} <FaArrowRightLong className="ml-2 text-xl" />
      </button>
      <button
        type="button"
        onClick={onContinueAsGuest}
        className="w-full h-14 rounded-xl text-[#572E91] text-lg font-medium flex items-center justify-center border-2 border-[#572E91] bg-white"
      >
        {t("continueAsGuest")} <FaArrowRightLong className="ml-2 text-xl" />
      </button>
    </div>
  )
}