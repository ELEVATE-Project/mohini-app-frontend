import Header from "../dashboard/header";
import { useEffect, useState } from "react";
import Sidebar from "../dashboard/sidebar";
import VoiceBasedChat from "./voice-chat";
import { useLocalStorage } from "react-use";
import { MdRefresh } from "react-icons/md";
import Cookies from "universal-cookie";
import { getSessionDetails } from "../../services/api.service";
import getConfiguration from "../../configure";
import { useMediaQuery } from "react-responsive";

const cookies = new Cookies();
const current_company_config = getConfiguration();
const is_credit_access = current_company_config.company_subdomain === 'creditaccess';

function VoiceChat({ type="", variant="" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localChatHistory, setLocalChatHistory, removeLocalChatHistory] =
  useLocalStorage("chat-history", []);
  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });
  const storedType = type || localStorage.getItem('type');
  const storedVariant = variant || localStorage.getItem('variant');
  const isShikshalokamPublicType = storedType === "shikshalokam" && storedVariant ==='publicBot';

  useEffect(() => {
    if (type) {
      localStorage.setItem('type', type);
    }
    if (variant) {
      localStorage.setItem('variant', variant);
    }
  }, [type, variant]);

  return (
    <div>
      <div className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className={`absolute left-0 top-0 ${isOpen ? "h-full" : ""}`}>
          {(!isShikshalokamPublicType)&& <Sidebar
            isOpen={isOpen}
            toggle={setIsOpen}
            navigationList={[]}
            isMobileFirst={true}
          />}
        </div>
        <div className="pl-16">
          <Header
            logo = {null}
            isMobileFirst={isMobile}
            content={
              <button
                onClick={async () => {
                  removeLocalChatHistory();
                  const session = await getSessionDetails();
                  await cookies.set("sessionid", session.sessionid, {
                      path: "/"
                  });
                  localStorage.setItem('sessionid', JSON.stringify(session.sessionid));
                  localStorage.setItem('isChatVisible', JSON.stringify(false));
                  localStorage.setItem('chatbot_clickedOn?', '');
                  window.location.reload();
                }}
                className="px-2 py-1 mr-3 flex bg-red-50 rounded-md mt-2 items-center"
              >
                <MdRefresh className="text-xl mr-1  text-red-400" />
                Reset
              </button>
            }
          />
        </div>
      </div>
      <div className="w-full bg-slate-100" style={{ minHeight: 'calc(-80px + 100vh)' }}>
        <div className={"overflow-y flex  outline-1 outline-offset-[-1px] flex-col  justify-between"}>
          <div className="">
            <VoiceBasedChat type={storedType} variant={storedVariant}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceChat;
