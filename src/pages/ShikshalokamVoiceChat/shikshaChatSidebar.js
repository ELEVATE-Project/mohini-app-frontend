import {
  MdMenu,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../url";
import { FiPlus } from "react-icons/fi";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa6";
import "./shikshaChatStyle.css"
import { useTranslation } from "react-i18next";


const Sidebar = ({ 
  isOpen, toggle, isMobileFirst=false, showLogout=true, showScrollbarContent, resetChat, setIsResetCalled, languageToUse 
}) => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleLogout(){
    navigate(ROUTES.SHIKSHALOKAM_VOICE_CHAT_LOGIN);
  }

  return (
    <>
      <aside
        className={
          `aside-2  
          ${(isOpen ? 'aside-3' : 'aside-4')} ${(isOpen&&isMobileFirst)&& "aside-1"}`
        }
      >
        <div>
          <div className={`${isMobileFirst ? "" : "div46"}`}>
            <button className="p-3" onClick={() => toggle((prev) => !prev)}>
              {isOpen? <FaArrowLeft className="icon-4" />
                : <MdMenu className="icon-5" />}
            </button>
          </div>
          {!!isOpen && (
            <div className="div23">
              <div className="div65 div24">
                <p>{t('allMicroImprovement')}</p>
              </div>
              <div className="div65">
                <button 
                  className="button-4"
                  onClick={(e)=>{
                    setIsResetCalled(true);
                    resetChat(e)
                  }}
                >
                  <FiPlus className="icon-2" /> {t('newChat')}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="aside-div" id="shikshaScrollableDiv">
          {!!isOpen && (
            <>
              {showScrollbarContent && showScrollbarContent()}
            </>
          )}
        </div>
        
        {!!isOpen && showLogout && (
          <div className="div66">
            <button className="button-5"
              onClick={handleLogout}
            >
              <FaPowerOff className="icon-6 icon-2" /> {t('logout')}
            </button>
          </div>
        )}
      </aside>
    </>

  );
};

export default Sidebar;