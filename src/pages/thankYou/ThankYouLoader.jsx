import { BiLoader } from "react-icons/bi"
import { useTranslation } from "react-i18next"

export default function ThankYouLoader() {
  const { t } = useTranslation()
  return (
    <div className="loader-load-spinner">
      <div className="div67">
        <BiLoader className="loader-rotate-loader loader-icon" />
        <h2 className="form-label label1 font-bold text-lg sm:text-2xl text-center">
          {t("thankYouLoaderMessage", {
            defaultValue: "Thank you for taking the time to answer these questions. Please wait...",
          })}
        </h2>
      </div>
    </div>
  )
}