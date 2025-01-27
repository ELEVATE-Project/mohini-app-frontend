/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getProfileDetails, getSessionDetails } from "../services/api.service";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useUserDispatcher } from "../context/user";
import { useLocalStorage } from "react-use";
import USER_ACTIONS from "../context/user/user-actions";
import FormData from "./Form/FormData";
import ROUTES from "../url";
import {
  districtLabelArray,
  blockLabelArray,
  stateLabelArray,
} from "../shikshalokam-field-data";
import { BiLoader } from "react-icons/bi";
import "./custom-style.css"
import "../index.css"

const cookies = new Cookies();
const login_api_url = `/api/login/`;

function Login({ type, variant }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [userLanguage, setUserLanguage] = useState("");
  const [userState, setUserState] = useState("");
  const [userDistrict, setUserDistrict] = useState("");
  const [userBlock, setUserBlock] = useState("");
  const [phoneNumberField, setPhoneNumberField] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userDispatcher = useUserDispatcher();
  const [, setLocalUserData] = useLocalStorage("grit", {});
  const [, , removeLocalChatHistory] =
  useLocalStorage("chat-history", []);

  useEffect(() => {
    localStorage.removeItem('selected_type');
    localStorage.removeItem('isStoryFormedAfterCall');
    localStorage.removeItem('first_name');
    localStorage.removeItem('isChatVisible');
    localStorage.removeItem('type');
    localStorage.removeItem('variant');
    localStorage.removeItem('intro_message');
    localStorage.removeItem('isNewChatOpen');
    localStorage.removeItem('isOldChatOpen');
    localStorage.removeItem('showFileInput');
    localStorage.removeItem('company');
    localStorage.removeItem('state');
    removeLocalChatHistory();
    localStorage.removeItem('sessionid');
    localStorage.removeItem('profileid');
    localStorage.removeItem('access_token');
    localStorage.removeItem('route');
    localStorage.removeItem('botName');
    localStorage.removeItem('isRecordButtonClicked');
    localStorage.removeItem('grit');
    localStorage.removeItem('companyData');
    localStorage.removeItem('isCallError');
    localStorage.removeItem('timerStart');
    localStorage.removeItem('showHomepage');
    localStorage.removeItem('model');
    localStorage.removeItem('has_accepted_tnc');
    localStorage.removeItem('flow');
    
    cookies.remove("profileid", {
      path: "/",
    });
    cookies.remove("access_token", {
      path: "/",
    });
    cookies.remove("company", {
      path: "/",
    });
    cookies.remove("sessionid", {
      path: "/",
    });
    cookies.remove('messageid', {
      path: '/',
    });
    cookies.remove('route', {
      path: '/',
    });
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

  }, []);


  const handlePhoneChange = (e) => {
    if (e?.target?.value?.length <= 10) {
      const numericInput = e?.target?.value?.replace(/[^0-9]/g, "");
      setPhoneNumberField(numericInput);
    }
  };

  const handleLanguageChange = (e) => {
    setUserLanguage(e.target.value);
  };

  const handleStateChange = (e) => {
    setUserState(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setUserDistrict(e.target.value);
  };

  const handleBlockChange = (e) => {
    setUserBlock(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
  };

  const handleNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const isValidIndianMobileNumber = (number) => {
    const regex = /^(?!.*(\d)(\1{9}))[6-9]\d{9}$/;
    return regex.test(number);
  };

  const getDistrictLabelValue = () => {
    return districtLabelArray[userState]?.map((district) => ({
      label: district,
      value: district,
    }));
  };

  const getBlockLabelValue = () => {
    const districtName = userDistrict.toUpperCase();
    return blockLabelArray[userState]
      ?.filter((block) => block.district.toUpperCase() === districtName)
      ?.map((block) => ({
        label: block.block,
        value: block.block,
      }));
  };

  const getStateLabelValue = () => {
    return stateLabelArray.map((state) => ({
      label: state?.state,
      value: state?.state,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setFieldError("");

    if (phoneNumberField && !isValidIndianMobileNumber(phoneNumberField)) {
      setFieldError("Please enter a valid phone number.");
      setTimeout(() => {
        setFieldError("");
      }, 10000);
      return;
    }

    const body = {
      first_name: firstName,
      email: emailId,
      preferred_route: userLanguage,
      company: "shikshalokamstaging",
      password: "grit@123",
      profile_address: [
        {
          state: userState,
          block: userBlock,
          district: userDistrict,
        },
      ],
    };

    setIsLoading(true);
    const res = await getProfileDetails(body);

    if (res?.status === "error") {
      setLoginErrorMessage(res?.message.slice(2, -2));
      setIsLoading(false);
      return;
    }
    let session = await getSessionDetails();
    localStorage.setItem('profileid', JSON.stringify(res.id));
    localStorage.setItem('route', JSON.stringify(userLanguage));
    localStorage.setItem('sessionid', JSON.stringify(session.sessionid));
    localStorage.setItem('isNewChatOpen', JSON.stringify(true));

    const response = await axiosInstance({
      url: login_api_url,
      method: "POST",
      data: {
        email: emailId,
        password: "grit@123",
      },
    });


    if (!!response?.data?.access_token) {
      userDispatcher({
        type: USER_ACTIONS.LOGIN,
        payload: response?.data,
      });
      localStorage.setItem('first_name', JSON.stringify(response?.data?.first_name));
      localStorage.setItem('access_token', JSON.stringify(response?.data?.access_token));
      localStorage.setItem('company', JSON.stringify(response?.data?.company));
      localStorage.setItem('state', JSON.stringify(response?.data?.state));
      localStorage.setItem('flow', 'login');
      cookies.set("profileid", JSON.stringify(response?.data?.id), {
        path: "/",
      });
      cookies.set("access_token", response?.data?.access_token, {
        path: "/",
      });
      setLocalUserData(response?.data);
      navigate(ROUTES.SHIKSHALOKAM_VOICE_CHAT);
    } else {
      navigate("/login");
      window.location.reload();
    }

    setIsLoading(false);
  };

  return (
    <div className="container max-w-full md mt-0 mx-auto grid md:grid-cols-2 justify-center h-screen">
      <div className="px-5 hidden sm:block">
          <div className="flex">
            <img
              src="./images/shikshagrahaLogo.png"
              className="h-[100px] w-[200px] object-contain aspect-auto align-top object-[center_center] relative ml-0"
              alt="shikshalokam_logo"
            />
          </div>
          <div className="text-left sm:text-2xl text-md text-slate-700">
                    <b>Impact Stories</b>
                </div>
                 <p className="pt-4 pb-4">MItra is an AI-powered multi-lingual, voice-enabled chatbot that helps school leaders reflect on their Micro-Improvement journeys. Through guided prompts, MItra enables leaders  to share the highlights, challenges and impacts of thier efforts, compiling responses into an inspiring and meaningful story.</p>
        <img
          src="https://mohini-static.shikshalokam.org/fe-images/PNG/Shikshalokam/innovationpana-1@2x.png"
          width="500"
          height="900"
          className="center-img custom-login-image"
          alt=""
        />
      </div>
      <div className="">
        <div className="justify-center w-full flex sm:hidden">
          <div className="w-[100%]">
            
                <div className="flex p-2 mx-auto px-auto items-center justify-center">
                 <img
                  src="https://static-media.gritworks.ai/fe-images/PNG/Shikshalokam/shikshalokam_logo_pdf.png"
                  className="h-[60px] w-[auto] mt-6 mb-2 object-fill aspect-auto align-top object-[center_center] relative ml-2"
                  alt="grit_Logo"
                />
              </div>
          </div>
        </div>
        <div className="bg-slate-50 h-full sm:pt-6">

            <>
              <div className="text-center sm:text-2xl text-md pt-10 text-slate-700">
                <b>Welcome</b>
              </div>
            </>
          <div className="p-2 text-center">
            <form id="myForm" onSubmit={submitForm}>
              <>
                <div className="text-left text-slate-700 mt-7 ml-[7%] md:ml-[18%]">
                  <b>First Name</b>
                </div>
                <div>
                  <input
                    className="bg-white text-slate-600 rounded-md p-3 mt-1 outline outline-slate-300 outline-1 outline-offset w-[95%] md:w-[65%]"
                    name="first_name"
                    required
                    type="text"
                    value={firstName}
                    onChange={handleNameChange}
                  />
                </div>
              </>

                <>
                  <FormData layOut={1} isRequired={true}  labelName="E-mail ID" id="emailID" inputType="email" inputName="email"
                    labelDivClass="text-left text-slate-700 mt-6 ml-[7%] md:ml-[18%]"
                    inputClass="bg-white text-slate-600 rounded-md p-3 mt-1 outline outline-slate-300 outline-1 outline-offset w-[95%] md:w-[65%]"
                    inputOnChange={handleEmailChange}
                    inputValue = {emailId}
                  />
                  <FormData layOut={2} labelName="language" id="languageID" selectID="languageID" selectName="language"
                    selectOptions={[{label:'English', value:'/'}
                    ,{label:'Hindi', value:'/hindi'}
                  ]}  
                    labelDivClass="text-left text-slate-700 mt-6 ml-[7%] md:ml-[18%]"
                    selectValue = {userLanguage}
                    selectClassName="bg-white text-slate-600 rounded-md p-3 mt-1 outline outline-slate-300 outline-1 outline-offset w-[95%] md:w-[65%]"
                    selectOnChange={handleLanguageChange}
                  />
                  <FormData layOut={2} labelName="State" id="stateNameID" selectID="stateNameID" selectName="stateName"
                    selectOptions={getStateLabelValue()}
                    labelDivClass="text-left text-slate-700 mt-6 ml-[7%] md:ml-[18%]"
                    selectValue = {userState}
                    selectClassName="bg-white text-slate-600 rounded-md p-3 mt-1 outline outline-slate-300 outline-1 outline-offset w-[95%] md:w-[65%]"
                    selectOnChange={handleStateChange}
                  />
                  <FormData layOut={2} labelName="District Name" id="districtNameID" selectID="districtNameID" selectName="districtName"
                    selectOptions={getDistrictLabelValue()}
                    labelDivClass="text-left text-slate-700 mt-6 ml-[7%] md:ml-[18%]"
                    selectValue = {userDistrict}
                    selectClassName="bg-white text-slate-600 rounded-md p-3 mt-1 outline outline-slate-300 outline-1 outline-offset w-[95%] md:w-[65%]"
                    selectOnChange={handleDistrictChange}
                  />
                  <FormData layOut={2} labelName="Block Name" id="blockNameID" selectID="blockNameID" selectName="blockName"
                    selectOptions={getBlockLabelValue()}
                    labelDivClass="text-left text-slate-700 mt-6 ml-[7%] md:ml-[18%]"
                    selectValue = {userBlock}
                    selectClassName="bg-white text-slate-600 rounded-md p-3 mt-1 outline outline-slate-300 outline-1 outline-offset w-[95%] md:w-[65%]"
                    selectOnChange={handleBlockChange}
                  />
                </>
              
              <div>
                <label
                  id="error-form"
                  className="text-rose-600 mt-1 ml-[18%] mb-0"
                ></label>
              </div>
              <div>
                {/* <a href="#" className="no-underline"> */}
                {(loginErrorMessage && loginErrorMessage !== '')&&(
                  <p className="text-red-500 font-bold text-sm">{loginErrorMessage}</p>
                )}
                <button
                  id="demo"
                  className=" p-3 mt-6 mb-2 px-5 py-3 bg-mira-red-original hover:bg-mira-red-original text-white rounded-md"
                  style={{backgroundColor: "#572E91"}}
                  type="submit"
                >
                  Let's Get Started
                </button>
                {/* </a> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      {isLoading&& 
        <div className="login-load-spinner">
          <div className="login-div67">
            <BiLoader className="login-rotate-loader login-loader-icon" />
          </div>
        </div> 
      }
    </div>
  );
}

export default Login;

/* eslint-disable react-hooks/exhaustive-deps */
