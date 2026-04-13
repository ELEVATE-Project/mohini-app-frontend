import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSiteDataSessionStore } from "store";
import { loadI18nForFlow } from "./i18n";
import LoadingSpinner from "./components/LoadingSpinner";

function I18nLoader({ children }) {
  const [ready, setReady] = useState(false);
  const [currentKey, setCurrentKey] = useState("");

  const location = useLocation();

  const language = useSiteDataSessionStore(state => state.getChatLanguage());
  const flowFromStore = useSiteDataSessionStore(state => state?.chatData?.flow);

  const urlParams = new URLSearchParams(location.search);
  const urlFlow = urlParams.get("flow");

  const flow = urlFlow || flowFromStore || "common_flow";
  const lang = language || "en";

  const newKey = `${flow}-${lang}`;

  useEffect(() => {
    async function init() {
      setReady(false);

      await loadI18nForFlow(flow, lang);

      setReady(true);
    }

    if (currentKey !== newKey) {
      setCurrentKey(newKey);
      init();
    }
  }, [newKey]);

  if (!ready || currentKey !== newKey) {
    return <div>
      <LoadingSpinner isVisible={true} />
    </div>;
  }

  return children;
}

export default I18nLoader;