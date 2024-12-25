import {
  MdMenu,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../url";
import { FiPlus } from "react-icons/fi";
import { FaArrowLeft, FaPowerOff } from "react-icons/fa6";
import "./shikshaChatStyle.css"

const Sidebar = ({ isOpen, toggle, isMobileFirst=false, showLogout=true, showScrollbarContent, resetChat, setIsResetCalled }) => {

  const navigate = useNavigate();

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
            <>
              <div className="div23">
                <div className="div65 div24">
                  <p>All Micro Improvements</p>
                </div>
                <div className="div65">
                  <button 
                    className="button-4"
                    onClick={(e)=>{
                      setIsResetCalled(true);
                      resetChat(e)
                    }}
                  >
                    <FiPlus className="icon-2" /> New chat
                  </button>
                </div>
              </div>
              {showScrollbarContent && showScrollbarContent()}
            </>
          )}
        </div>
        
        {!!isOpen && showLogout && (
          <div className="div66">
            <button className="button-5"
              onClick={handleLogout}
            >
              <FaPowerOff className="icon-6 icon-2" /> Logout
            </button>
          </div>
        )}
      </aside>
    </>

  );
};

export default Sidebar;