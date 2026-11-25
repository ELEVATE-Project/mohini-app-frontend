import { setLanguage } from "i18n"
import { languageList } from "../pages/ShikshalokamVoiceChat/enum"
import FormData from "./Form/FormData"
import { useSiteDataSessionStore } from "store"

const DEFAULT_SELECT_CLASS = "bg-white text-slate-600 rounded-3xl p-3 mt-0 outline outline-slate-300 outline-1 outline-offset min-w-max"

const LanguageSelector = ({
  // userLanguage,
  // onLanguageChange,
  className = "",
  isVisible = true,
  // fluid: plain select that fills its container and never overflows (used in the sidebar)
  fluid = false,
  // unique id per instance, so two selectors on one page don't share an id
  id = "languageSelector",
}) => {
  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)
  const setChatLanguage = useSiteDataSessionStore(state => state.setChatLanguage)

  function handleChangeLanguage(lang) {
    console.log("[language] changed to", lang)
    setChatLanguage(lang)
    setLanguage(lang)
  }

  if (!isVisible) return null

  if (fluid) {
    return (
      // relative z-10: sits above any overlay so clicks reach the select
      <div className={`relative z-10 w-full min-w-0 max-w-full overflow-hidden ${className}`}>
        <select
          id={id}
          name="language"
          value={chatLanguage}
          onChange={e => handleChangeLanguage(e.target.value)}
          className="block w-full min-w-0 max-w-full truncate rounded-3xl border border-slate-300 bg-white px-3 py-3 text-slate-600 outline-none"
        >
          {languageList.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className={`relative z-10 min-w-[100px] max-w-[100px] ${className}`}>
      <FormData layOut={2} labelName="" id={`${id}ID`} selectID={`${id}ID`} selectName="language" selectOptions={languageList} labelDivClass="text-left text-slate-700" selectValue={chatLanguage} selectClassName={DEFAULT_SELECT_CLASS} selectOnChange={e => handleChangeLanguage(e.target.value)} />
    </div>
  )
}

export default LanguageSelector