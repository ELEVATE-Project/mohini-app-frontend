import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import { useUserDispatcher } from "../../context/user";
import USER_ACTIONS from "../../context/user/user-actions";
import Cookies from "universal-cookie";
import axiosInstance from "../../utils/axios";
import getConfiguration, { company_list } from "../../configure";
import { Link } from "react-router-dom";
import ROUTES from "../../url";
import { removeFromStorage } from "../../services/storage_service";

const logout_api_url = `/api/logout/`;
const company_config = getConfiguration();
const cookies = new Cookies();

const Logout = () => {
  const [localUserData, setLocalUserData, removeUserLocalData] =
    useLocalStorage("grit", {});
  const userDispatcher = useUserDispatcher();
  const [companyData, setCompanyData, removeCompanyData] = useLocalStorage("companyData", {});
  const [isStoryFormedAfterCall, setIsStoryFormedAfterCall, removeIsStoryFormedAfterCall] = useLocalStorage("isStoryFormedAfterCall", {});
  const [isRecordButtonClicked, setIsRecordButtonClicked, removeIsRecordButtonClicked] = useLocalStorage("isRecordButtonClicked", {});

  useEffect(() => {
    async function logout() {
      try {
        const response = await axiosInstance({
          url: logout_api_url,
          method: "POST",
          headers: {
            Authorization: `Bearer ${localUserData?.access_token}`,
          },
        });
        removeUserLocalData();
        userDispatcher({
          type: USER_ACTIONS.RESET,
          payload: {},
        });
        cookies.remove("profileid", {
          path: "/",
        });
        cookies.remove("accessToken", {
          path: "/",
        });
        cookies.remove("company", {
          path: "/",
        });
        cookies.remove("sessionid", {
          path: "/",
        });
        cookies.remove("route", {
          path: "/",
        });
        cookies.remove("first_name", {
          path: "/",
        });
        cookies.remove("interviewsessionid", {
          path: "/",
        });
        cookies.remove('temp_sessionid', {
          path: "/",
        });
        cookies.remove('first_name', {
          path: '/',
        })
        cookies.remove('messageid', {
          path: '/',
        })
        cookies.remove('company_slug', {
          path: '/',
        })
        cookies.remove("state", {
          path: "/",
        });
        cookies.remove("fName", {
          path: "/",
        });
        cookies.remove("location", {
          path: "/",
        });
        cookies.remove("org_associated", {
          path: "/",
        });
        cookies.remove("product_interested", {
          path: "/",
        });
        removeCompanyData();
        removeIsStoryFormedAfterCall();
        removeIsRecordButtonClicked();
        removeFromStorage('countdownTime', true, 'localStorage');
        removeFromStorage('profileid', true, 'localStorage');
        removeFromStorage('sessionid', true, 'localStorage');
        removeFromStorage('route', true, 'localStorage');
        removeFromStorage('countdownTime_times', true, 'localStorage');
        removeFromStorage('chatbot_clickedOn?', true, 'localStorage');
        removeFromStorage('isChatVisible', true, 'localStorage');
        removeFromStorage('chat-history', true, 'localStorage');
        removeFromStorage('isCallError', true, 'localStorage');
        removeFromStorage('timerStart', true, 'localStorage');
        removeFromStorage('botName', true, 'localStorage');
        removeFromStorage('type', true, 'localStorage');
        removeFromStorage('accessToken', true, 'localStorage');
        removeFromStorage('company', true, 'localStorage');
        removeFromStorage('state', true, 'localStorage');
        removeFromStorage('showHomepage', true, 'localStorage');
        removeFromStorage('showFileInput', true, 'localStorage');
        removeFromStorage('intro_message', true, 'localStorage');
        removeFromStorage('isOldChatOpen', true, 'localStorage');
        removeFromStorage('isNewChatOpen', true, 'localStorage');
        removeFromStorage('model', true, 'localStorage');
    

      } catch (error) {
        console.error({ error });

        removeUserLocalData();
        userDispatcher({
          type: USER_ACTIONS.RESET,
          payload: {},
        });
        cookies.remove("profileid", {
          path: "/",
        });
        cookies.remove("accessToken", {
          path: "/",
        });
        cookies.remove("company", {
          path: "/",
        });
        cookies.remove("sessionid", {
          path: "/",
        });
        cookies.remove("route", {
          path: "/",
        });
        cookies.remove("first_name", {
          path: "/",
        });
        cookies.remove("interviewsessionid", {
          path: "/",
        });
        cookies.remove('temp_sessionid', {
          path: "/",
        });
        cookies.remove('first_name', {
          path: '/',
        })
        cookies.remove('messageid', {
          path: '/',
        })
        cookies.remove('company_slug', {
          path: '/',
        })
        cookies.remove("state", {
          path: "/",
        });
        cookies.remove("fName", {
          path: "/",
        });
        cookies.remove("location", {
          path: "/",
        });
        cookies.remove("org_associated", {
          path: "/",
        });
        cookies.remove("product_interested", {
          path: "/",
        });
        removeCompanyData();
        removeIsStoryFormedAfterCall();
        removeIsRecordButtonClicked();
        removeFromStorage('countdownTime', true, 'localStorage');
        removeFromStorage('profileid', true, 'localStorage');
        removeFromStorage('sessionid', true, 'localStorage');
        removeFromStorage('route', true, 'localStorage');
        removeFromStorage('countdownTime_times', true, 'localStorage');
        removeFromStorage('chatbot_clickedOn', true, 'localStorage');
        removeFromStorage('isChatVisible', true, 'localStorage');
        removeFromStorage('chat-history', true, 'localStorage');
        removeFromStorage('isCallError', true, 'localStorage');
        removeFromStorage('timerStart', true, 'localStorage');
        removeFromStorage('showHomepage', true, 'localStorage');
        removeFromStorage('showFileInput', true, 'localStorage');
        removeFromStorage('intro_message', true, 'localStorage');
        removeFromStorage('isOldChatOpen', true, 'localStorage');
        removeFromStorage('isNewChatOpen', true, 'localStorage');
        removeFromStorage('model', true, 'localStorage');
        removeFromStorage('llmError', true, 'localStorage');
      }
    }
    if (!!Object.keys(localUserData || {}).length) {
      logout();
    }
    return () => {};
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center text-2xl text-gray-600 font-semibold">
      <div className="p-2">
        <p className="text-center">{getLogoutText()}</p>
          <p className="text-center">
            <Link className="text-teal-500 underline py-4 block" to={company_config.reroute}>
              Go to Login
            </Link>
          </p>
      </div>
    </div>
  );
};

export default Logout;

const getLogoutText = () => {
  switch (getConfiguration().company_subdomain) {
    case company_list.shikshalokam:  
      return "Thank you, you have successfully attempted your session.";
    default:
      return "You have successfully logged out!";
  }
};
