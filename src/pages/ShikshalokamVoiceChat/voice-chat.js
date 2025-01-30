/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdAccountCircle,
  MdEdit,
  MdSend,
} from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import getConfiguration, { bot_routes, bot_websocket } from "../../configure";
import { useLocalStorage } from "react-use";
import useVoiceRecord, { default_wave_surfer_config } from "../interview-text-voice/useVoiceRecord";
import WaveSurferPlayer from "../interview-text-voice/voice-player";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CustomFormData from "../../components/Form/FormData";
import { useUserStore } from "../../context/user";
import { createMessage } from "../interview-voice";
import axiosInstance from "../../utils/axios";
import Cookies from "universal-cookie";
import DOMPurify from "dompurify";
import rehypeRaw from 'rehype-raw';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BiLoader } from "react-icons/bi";
import { getSessionDetails } from "../../services/api.service";
import Sidebar from "./shikshaChatSidebar";
import MainHeader from "./shikshaChatHeader";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { createAuthRequest, createStoryMedia, getStoryAllMedia, partialUpdateStoryById } from "../story/api.service";
import { GrGallery } from "react-icons/gr";
import { FiDownload } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import EditorJS from "@editorjs/editorjs";
import SimpleImage from "@editorjs/simple-image";
import Header from "@editorjs/header";

import PdfDownloader from "../story/upload-content/pdfDownloader";
import { FaMicrophone } from "react-icons/fa";
import "../../style.css"
import "./shikshaChatStyle.css"
// import Progressbar from "../../components/ProgressBar/ProgressBar";
import Swal from 'sweetalert2';
import { PrimaryButton } from "../../components/Buttons";
import { IoClose } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES from "../../url";
import PrivacyPolicyPage from "../../components/TnC/privacyPolicy";
import { useTranslation } from "react-i18next";


const cookies = new Cookies();
const company_bot_list_url = `/api/companybot/`;

const current_company_config = getConfiguration();

const wss_protocol = window.location.protocol === "https:" ? "wss://" : "ws://";

function useCustomMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure the window object is available
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      const isMatching = media.matches;
      
      setMatches(isMatching); // Set the initial value

      const listener = () => setMatches(isMatching);
      media.addEventListener('change', listener);

      // Clean up event listener on unmount
      return () => media.removeEventListener('change', listener);
    }
  }, [query]);
  

  return matches;
}


const ShikshalokamVoiceBasedChat = ({ type="", variant="" }) => {
  // const recognitionRef = useRef(
  //   new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  // );
  const [profileToUse, setProfileToUse] = useState(JSON.parse(localStorage.getItem('profileid')) || null);
  const audioRef = useRef();
  const lastBotMessageIndex = useRef(-1);
  let access_token = localStorage.getItem('accToken');
  let globalSessionID = JSON.parse(localStorage.getItem('sessionid'))

  const isInitialLoadRef = useRef(true);
  const [storyMediaIdArray, ] = useState(null);

  const [searchParams] = useSearchParams();
  
  // const isMobile = false;

  const [localChatHistory, setLocalChatHistory, removeLocalChatHistory] =
    useLocalStorage("chat-history", []);
  const [chatHistory, setChatHistory] = useState(
    !!localChatHistory?.length ? localChatHistory : []
  );
  const [chatSocket, setChatSocket] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [reconText, setReconText] = useState("");
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);
  const [audioCache, setAudioCache] = useState({});
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const editorContainerRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editorCopyChanges, setEditorCopyChanges] = useState(null);
  const [hasStartedListening, setHasStartedListening] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [botNameToDisplay, setBotNameToDisplay] = useState('Bot')
  const [hasStartedRecording, setHasStartedRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [transcript, ] = useState('');
  const [sentences, setSentences] = useState([]);
  const [isNextAllowed, setIsNextAllowed] = useState(true);
  const [isMute, setNotMute] = useState(true);
  const [isTalking, setTalking] = useState(0);
  const [appendix, setAppendix] = useState([]);
  const [hasOverRideId, setHasOverRideId] = useState(null);
  const [shouldFetchIntro, setShouldFetchIntro] = useState(false);
  const [hasFetchIntro, setHasFetchIntro] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(() => {
    const storedVisibility = localStorage.getItem('isChatVisible');
    return storedVisibility !== null ? JSON.parse(storedVisibility) : false;
  });
  const [chatTitle, setChatTitle] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIntroLoading, setIsIntroLoading] = useState(false);
  const [isFetchingOldIntro, setIsFetchingOldIntro] = useState(false);
  const [sessionTitleDetail, setSessionTitleDetail] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isResetCalled, setIsResetCalled] = useState(false);
  const introMessageRef = useRef(null);
  const [strandStep, setStrandStep] = useState(null);
  const [isEndStoryLoading, setIsEndStoryLoading] = useState(false);
  const [storyData, setStoryData] = useState(null);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [showHomepage, setShowHomepage] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [showFileInput, setShowFileInput] = useState(null);
  const [shouldSendMessage, ] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptedTnc, setAcceptedTnC] = useState(localStorage.getItem('has_accepted_tnc')|| 'ONGOING');
  const [stateMachineLength, setStateMachineLength] = useState(localStorage.getItem('statemachine_length') || 0);

  const { t } = useTranslation();

  const selectedLabel = {
    types: [
      {label:t('guidedReflection'), value:'normal'}, 
      {label:t('oneStepReflection'), value:'oneshot'}, 
    ]
 }; 

 const selectedType = JSON.parse(localStorage.getItem('selected_type')) || selectedLabel.types[0].value;

  const endPageToScrollRef = useRef(null);

  const [error, setError] = useState({
    response: "",
    status: 200,
  });
  const [isUploading, ] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileErrorText, setFileErrorText] = useState('');

  const fileExceedText = t('fileExceedText');
  const fileSizeText = t('fileSizeText');
  const completedStatusText = t('completedStatusText');
  const inProgressStatusText = t('inProgressStatusText');

  let isMobile = useCustomMediaQuery('(max-width: 500px)');
  let chatToAddLength = isMobile? 10: 10;
  const [visibleItemCount, setVisibleItemCount] = useState(chatToAddLength);
  const isNewChatOpen = JSON.parse(localStorage.getItem('isNewChatOpen'));

  const projectId = searchParams.get("projectId");

  const [languageToUse, setLanguageToUse] = useState(JSON.parse(localStorage.getItem("route")) || "en");


  let params = new URL(document.location).searchParams;
  const code = params.get("code");
  const {
    recordings,
    HiddenRecorder,
  } = useVoiceRecord();

  const isShikshalokamPublicType = true;
 
  const shouldShowChatHistoryFeature = true;
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const openModal = () => {
    
    setIsModalOpen(true);
  };

  useEffect(()=>{
    
    if ((!projectId) && !profileToUse && !access_token) {
      navigate(ROUTES.SHIKSHALOKAM_VOICE_CHAT_LOGIN)
    }

  }, [projectId, profileToUse])

  useEffect(() => {
    // Function to create user profile
    async function createUserProfile() {
      try {
        setIsLoading(true);
        const headers = {
          "Content-Type": "application/json",
        };
        let body = {
          access_token: access_token,
        };

        const response = await axiosInstance.post(`/api/create-profile/`, body, { headers });
        
        if (response && response?.status === 200) {
          const data  = response?.data.profile_details;
          
          localStorage.setItem('profileid', data?.id);
          setProfileToUse(data?.id)
          let sessionid = localStorage.getItem('sessionid');
          if (!sessionid) {
            let session = await getSessionDetails();
            localStorage.setItem('sessionid', JSON.stringify(session.sessionid));
            globalSessionID = session?.sessionid;
      }
          const preferredLanguage = JSON.parse(localStorage.getItem('preferred_language') || '{}');
          const language = preferredLanguage.value || 'en';
          localStorage.setItem('route', JSON.stringify(language || "en"));
          setLanguageToUse(JSON.stringify(language || "en"));
          localStorage.setItem('isNewChatOpen', JSON.stringify(true));
          localStorage.setItem('first_name', JSON.stringify(data?.first_name));
          localStorage.setItem('company', JSON.stringify(data?.company?.slug));
          localStorage.setItem('state', JSON.stringify(data?.profile_address[0]?.state));
        } else {
          //navigate(ROUTES.EXIT_ROUTE)
          clearFromStorage()
          navigate(-1)
          // window.location.href=ROUTES.EXIT_ROUTE
        }
      } catch (error) {
        console.error(error?.response?.data || error);
        //navigate(ROUTES.EXIT_ROUTE)
          clearFromStorage()
          navigate(-1)
          // window.location.href=ROUTES.EXIT_ROUTE

      } finally {
        // setIsLoading(false);
      }
    }
    
    
    // Check if profile ID is in localStorage, if not, create the profile
    if (!profileToUse && access_token) {
      
      createUserProfile();
      setShouldFetchIntro(true);
      setIsStreamingComplete(true);
    }
  }, [access_token, profileToUse]);


  useEffect(()=>{
    
    async function fetchChatSession() {
      const response = await axiosInstance({
        url: `/api/chatsession?project_id=${projectId}`,
      })
      
      if (response?.status === 200 && response?.data?.results[0]?.session) {
        localStorage.setItem('sessionid', JSON.stringify(response?.data?.results[0]?.session))
        globalSessionID = response?.data?.results[0]?.session

        localStorage.setItem('isOldChatOpen', JSON.stringify(true));
        localStorage.setItem('isNewChatOpen', JSON.stringify(false));
      }
    }

    if(projectId) {
      fetchChatSession()
    }
  
  }, [projectId])

  useEffect(()=>{
   
   
  
    setVisibleItemCount(chatToAddLength)
  }, [chatToAddLength])

  useEffect(()=>{
   
  }, [visibleItemCount])


  useEffect(() =>{
    if(isFetchingOldIntro){
      let temp_intro_message = localStorage.getItem('intro_message');
      introMessageRef.current = temp_intro_message;
    }
  },[isFetchingOldIntro])

  useEffect(()=>{
    
  }, [error])

  useEffect(()=>{
    const textErrorTime = setTimeout(()=>{
      setFileErrorText("")
    }, 5000);

    return ()=>{
      clearTimeout(textErrorTime);
    }
  },[fileErrorText])

  useEffect(() => {
    async function callEndStory() {
      if (isStreamingComplete && strandStep >= stateMachineLength) {
        try {
          setIsLoading(true);
          setIsEndStoryLoading(true);
  
          const sessionid = JSON.parse(localStorage.getItem('sessionid'));
          const end_story_api_url = `/api/end-story/`;
          
          let sourceLanguage = JSON.parse(localStorage.getItem('preferred_language'))?.value || languageToUse;
  
          const endStoryResponse = await axiosInstance({
            url: end_story_api_url,
            data: {
              session: sessionid,
              profile_id: profileToUse,
              stage: 'COMPLETED',
              access_token: access_token,
              flow: localStorage.getItem('flow'),
              language: sourceLanguage
            },
            method: "POST",
          });
          
  
          if (endStoryResponse?.data?.id) {
            setFiles([]);
            setShowFileInput(true);
            window.location.reload();
          }
        } catch (error) {
          console.error('Error completing the story:', error);
          //navigate(ROUTES.EXIT_ROUTE)
          if (projectId){
            clearFromStorage()
            navigate(-1)
            // window.location.href=ROUTES.EXIT_ROUTE;
          }

        } finally {
          setIsEndStoryLoading(false);
          setIsLoading(false);
        }
      }
    }
  
    if (isStreamingComplete && stateMachineLength && strandStep >= stateMachineLength) {
      callEndStory();
    }
  }, [isStreamingComplete, strandStep, access_token, stateMachineLength, languageToUse]);
    useEffect(()=>{
    let profileid = cookies.get('profileid') || localStorage.getItem('profileid')
    if(!profileid && !access_token) window.location.href=ROUTES.SHIKSHALOKAM_VOICE_CHAT_LOGIN;
    
  
    if(isShikshalokamPublicType){
      setShouldFetchIntro(true);
      setIsStreamingComplete(true);
    }
  }, [isShikshalokamPublicType])

  useEffect(() => {
    if(shouldShowChatHistoryFeature) {
      const isOldChatOpen = JSON.parse(localStorage.getItem('isOldChatOpen'));
      if(isOldChatOpen === true){
        setShouldFetchIntro(false);
        setShowHomepage(false);
        // removeLocalChatHistory();
        MakeSocketConnection();
      } else if(isNewChatOpen === true){
        const showStartPage = JSON.parse(localStorage.getItem('showHomepage'));
        setShowHomepage(showStartPage !== null ? showStartPage : true);
        MakeSocketConnection();
      }
    } else{
      removeLocalChatHistory();
      MakeSocketConnection();
    }
  }, [isNewChatOpen]);

  useEffect(()=>{
    const isOldChatOpen = JSON.parse(localStorage.getItem('isOldChatOpen'))
    const flow = localStorage.getItem('flow')
    if(isOldChatOpen === true && (hasFetchIntro || flow==='login') ) {
      handleChatSessionButtonClick({key: null})
    }
  }, [isNewChatOpen, hasFetchIntro])


  useEffect(() => {
    if (!!editorCopyChanges && isModalOpen && storyData) {
      let parsed_content = [];
      try {
        parsed_content = editorCopyChanges.map(item => ({
          type: item.type,
          data: {
            text: item.data.text
          }
        }));
    } catch (error) {
        parsed_content = [];
        
      }
      const _editor = new EditorJS({
        /**
         * Id of Element that should contain the Editor
         */
        holder: "editorjs",

        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        tools: {
          image: SimpleImage,
          header: {
            class: Header,
            shortcut: "CMD+SHIFT+H",
          },
        },
        onReady: (ready) => {
          
          setEditor(_editor);
        },
        data: {
          blocks: parsed_content,
        },
        onChange: async (api, event) => {
          
          setIsSaving(false);
        
          const savedData = await api.saver.save();
          const imageBlocks = savedData.blocks.filter(block => block.type === 'image');
          if(!isInitialLoadRef.current ){
            if (storyMediaIdArray?.length !== imageBlocks?.length) {
          
              for (let i = 0; i < storyMediaIdArray?.length; i++) {
                const storyFile = storyMediaIdArray[i];
                let fileFound = false;
          
                for (let j = 0; j < imageBlocks?.length; j++) {
                  if (storyFile?.file === imageBlocks[j]?.data?.url) {
                    fileFound = true;
                    break;
                  }
                }
          
                if (!fileFound) {
                  partialUpdateMedia(storyFile?.id)
                }
              }
            }
          }
        },
      });
    }
    
    
    return () => {
      if (!!Object.keys(editor || {})?.length) editor.destroy();
    };
  }, [editorCopyChanges, isModalOpen, storyData]);

  const handleEditClick = () => {
    return (
      <>
        {/* Modal Overlay */}
        <div
          className="voice-chat-editor-overlay"
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div
            className="voice-chat-editor-content"
            onClick={(e) => {
              // Prevent closing modal when clicking inside
              e.stopPropagation()
            }}
          >
            <button
              onClick={closeModal}
              className="editor-content-button"
            >
              <IoClose className="icon-7" />
            </button>
            <div id="container-editor">
              <div
                className="container-editor-div"
              >
                <div id="editorjs" ref={editorContainerRef} className="editor-main-div">
                  {/* Code editor */}
                </div>
              </div>
            </div>
            <div className="editor-button-div">
            <PrimaryButton
              onClick={async () => {
                try {
                  const outputData = await editor.save();
                  
                  
                  await partialUpdateStoryById({
                    setter: setStoryData,
                    loader: setIsSaving,
                    data: {
                      id: storyData?.id,
                      formatted_content: outputData?.blocks,
                      access_token: localStorage.getItem('accToken'),
                      session: JSON.parse(localStorage.getItem('sessionid')),
                      flow: localStorage.getItem('flow')
                    },
                    token: access_token,
                  });
                  
                  if(projectId){
                    await updateReflectionStatus();
                  } else{
                    window.location.reload()
                  }

                } catch (error) {
                  console.error("Saving failed: ", error);
                  //navigate(ROUTES.EXIT_ROUTE)
                  if (projectId){
                    clearFromStorage()
                    navigate(-1)
                    // window.location.href=ROUTES.EXIT_ROUTE;
                  }
                }
              }}
              disabled={isLoading || isSaving}
            >
              {t('confirmChanges')}

            </PrimaryButton>
            </div>
          </div>
        </div>
      </>
    );
  };

  async function updateReflectionStatus(){
    try{
      const flow = localStorage.getItem('flow');

      if(flow === 'login') return;

      const response = await axiosInstance.post('api/update-project-status/', {
        access_token: localStorage.getItem('accToken'),
        project_id: projectId,
        flow: localStorage.getItem('flow')
      });

      if (response?.status === 200) {
        //navigate(ROUTES.EXIT_ROUTE)
        if (projectId){
          clearFromStorage()
          navigate(-1)
          // window.location.href=ROUTES.EXIT_ROUTE;

        }
      }
      
      return response;
    } catch (error) {
      //navigate(ROUTES.EXIT_ROUTE)
      if (projectId){
        clearFromStorage()
        navigate(-1)
        // window.location.href=ROUTES.EXIT_ROUTE;

      }
    }

  }

  const handleDownloadClick = () => {
    setIsLoading(true);
    setIsPdfDownloading(true);
    setTriggerDownload(true);
  };

  const handleDownloadStop = () => {
    
    setTriggerDownload(false);
    setIsLoading(false);
    setIsPdfDownloading(false);
    window.location.reload();
  };
  
  async function ResetChat(e) {
    if (e) {
      e.preventDefault();
    }
    if (isResetCalled && chatSocket && chatSocket.readyState === chatSocket.OPEN) {
      chatSocket.close();
    }
    removeLocalChatHistory();
    localStorage.setItem('isOldChatOpen', JSON.stringify(false));
    localStorage.setItem('isNewChatOpen', JSON.stringify(true));
    const session = await getSessionDetails();
    await cookies.set("sessionid", session.sessionid, {
        path: "/"
    });
    localStorage.setItem('sessionid', JSON.stringify(session.sessionid));
    localStorage.setItem('isChatVisible', JSON.stringify(false));
    localStorage.setItem('chatbot_clickedOn?', '');
    localStorage.setItem('showHomepage', true);
    localStorage.removeItem('has_accepted_tnc')
    window.location.reload();
  }
  
  // socket connection
  //wss://demo.shi /shikshalokam_new
  function MakeSocketConnection(){
    let socket;
    
    let url;

    if (!!code) {
      url = `${wss_protocol}${window.location.host}/ws/chat/company/`;
    } else {
        const base_url = `${wss_protocol}${process.env.REACT_APP_WEBSOCKET_HOST}`
        if (selectedType === 'normal') {
        if (localStorage.getItem('flow') && localStorage.getItem('flow') === 'login') {
          url = `${base_url+bot_websocket.normal}`;
        } else {
          url = `${base_url+bot_websocket.reflection}`;
        }
      } else {
        url = `${base_url+bot_websocket.oneshot}`;
      }
    }
    
    socket = new WebSocket(url);

    console.log("socket: ", socket)
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const message = data["text"];
    
      if (message.source === "bot") {
        setIsStreamingComplete(false);

        setSentences((prevSentences) => {
          const updatedSentences = [...prevSentences];
    
          if (
            updatedSentences.length > 0 &&
            updatedSentences[updatedSentences.length - 1]?.source === "bot"
          ) {
            // Append to the last bot message
            if (message?.msg) {
              updatedSentences[updatedSentences.length - 1].message += message?.msg;
            }
          } else {
            // Create a new bot message
            updatedSentences.push({
              message: message?.msg || "",
              source: "bot",
              isNarrated: false,
              id: new Date().valueOf(),
            });
            lastBotMessageIndex.current = updatedSentences.length - 1;
          }
          return updatedSentences;
        });
    
        // Update chat history in the same manner
        
        setChatHistory((prevChatHistory) => {
          const updatedChatHistory = [...prevChatHistory];
    
          if (
            updatedChatHistory.length > 0 &&
            updatedChatHistory[updatedChatHistory.length - 1]?.source === "bot"
          ) {
            
            // Append to the last bot message in chat history
            if (message?.msg) {
              updatedChatHistory[updatedChatHistory.length - 1].msg += message?.msg;
            }
          } else {
            // Create a new bot message in chat history
            
            
            updatedChatHistory.push({
              msg: message?.msg || "",
              source: "bot",
              updated_at: new Date().valueOf(),
            });
          }
          return updatedChatHistory;
        });
    
        if (isShikshalokamPublicType) {
          handleScrollToView();
        }
      } else{
        setIsStreamingComplete(false)
      }
    
      if (message.finish_reason === "stop" && message.source === "bot") {
        setStrandStep(message?.step);
        handleScrollToView();
        setTalking(0);
        setIsStreamingComplete(true);

      }
    };

    socket.onopen = () => {
      console.log('websocket open')
      setChatSocket(socket);
      let sessionid = JSON.parse(localStorage.getItem('sessionid'))
      let route = languageToUse
      let tempProfId = localStorage.getItem('profileid')
      
      if(tempProfId && sessionid){
        socket.send(JSON.stringify({
          type: 'authenticate',
          sessionid: sessionid,
          profileid: tempProfId,
          projectid: searchParams.get("projectId"),
          access_token: access_token,
          route: route,
        }));
      }
    };

    socket.onclose = (event) => {
      console.log("closed ", strandStep, isResetCalled)
      console.log("event ", event)
      if(!isResetCalled){
        showConfirmationPopup()
      }
    };

    socket.onerror = (event) => {
      console.log("error ", event)
    };

    return () => {
      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        
        chatSocket.close();
      }
    };
  }

  function showConfirmationPopup() {
    <div className="div-popup">
    {Swal.fire({
      title: t('popUpChanges'),
      // icon: 'question',
      showCancelButton: true,
      // confirmButtonText: getComfirmButtonTranslation(languageToUse),
      confirmButtonText: t('confirmChanges'),
      cancelButtonText: t('denyButton'),
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      } else {
        if (projectId){
          clearFromStorage()
          navigate(-1)
          // window.location.href=ROUTES.EXIT_ROUTE;

        } else {
          ResetChat();
        }
      }
    })}
    </div>
  }

  useEffect(()=>{
    if(chatHistory?.length!== 0){
      localStorage.setItem('isChatVisible', true);
      setIsChatVisible(true);
    }
  }, [])

  useEffect(()=>{
    // showConfirmationPopup()
 
    localStorage.setItem('showFileInput', showFileInput)

  }, [showFileInput])

  useEffect(()=>{
    const botName = localStorage.getItem('botName');
    setBotNameToDisplay(botName);

  }, [])

    async function getStoryBySession(sessionID, accessToken){
      const res = await axiosInstance({
        url: `api/get-story/?session=${sessionID}`,
      })
      
      return res?.data?.results;
    }

  function extractTextBlocks(formattedContent) {
    const blocks = JSON.parse(formattedContent);
    return blocks.filter(block => block.type === 'paragraph');
  }

  useEffect(()=>{
    if (!globalSessionID) return;

    (async () => {
      const story_data = await getStoryBySession(globalSessionID, access_token);
      
      if (story_data && story_data?.length > 0 && story_data[0]) {
        setStoryData(story_data[0]);
        const formatted_content = story_data[0].formatted_content;
        
        const textBlocks = extractTextBlocks(formatted_content);
        setEditorCopyChanges(textBlocks);
      }
    })();

  }, [access_token, globalSessionID])

  function handleFileUpload(e) {
    
    const story_id = storyData?.id;
    
    if (!story_id || story_id === '') return;
  
    const selectedFiles = Array.from(e.target.files); 
    const maxFileSize = 50 * 1024 * 1024; 
    const currentFiles = [...files];  
  
    const uploadPromises = selectedFiles.map((uploadedFile) => {
      if (uploadedFile.size > maxFileSize) {
        setFileErrorText(fileSizeText);
        // Skip oversized files
        return Promise.resolve();
      }
      const fileName = uploadedFile?.name;
      const fileExtension =  fileName ?  fileName.split('.').pop().toLowerCase() : '';
      const mediaTypes = {
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "svg": "image/svg+xml",
      };
      
      const mediaType = mediaTypes[fileExtension] || null;
      

      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("story", story_id);
      formData.append("name", fileName);
      formData.append("mediaType", mediaType);
      formData.append('include_in_story', true);
      formData.append('access_token', access_token);
      formData.append('flow', localStorage.getItem('flow'));
      formData.append('session', JSON.parse(localStorage.getItem('sessionid')));
      formData.append("media_type", mediaType);
  
      // Return a promise for each file upload
      return uploadImage(formData, story_id);
    });
  
    Promise.all(uploadPromises).then((uploadedFiles) => {
      // Filter out undefined entries (for skipped files)
      const validFiles = uploadedFiles.filter(Boolean);
      setFiles([...currentFiles, ...validFiles]);
    });
  }
  
  const uploadImage = (formData, storyId) => {
    return new Promise((resolve, reject) => {
      try {
        createStoryMedia({
          setter: (data) => {
            setError({});
            resolve({
              id: data.id,
              name: data.name,
              base64_str: `data:image/jpeg;charset=utf-8;base64,${data.base64_str}`,
              include_in_story: data.include_in_story,
            });
          },
          errorHandler: (err) => {
            //navigate(ROUTES.EXIT_ROUTE)
            if (projectId){
              clearFromStorage()
              navigate(-1)
              // window.location.href=ROUTES.EXIT_ROUTE;

            }
            setError(err);
            reject(err); 
          },
          loader: setIsLoading,
          data: formData,
          token: access_token,
        });
      } catch (error) {
        console.error({ error });
        //navigate(ROUTES.EXIT_ROUTE)
        if (projectId){
          clearFromStorage()
          navigate(-1)
          // window.location.href=ROUTES.EXIT_ROUTE;

        }
        reject(error);
      }
    });
  }


  useEffect(() => {
    if (storyData && storyData?.id !== '') {
      const story_id = storyData?.id;
      const tempMediaArr = []

      getStoryAllMedia({
        setter: (data) => {
          
          for (let item of Object.values(data?.results || [])) {
            
            if (item.include_in_story) {
              item.base64_str = `data:image/jpeg;charset=utf-8;base64,${item.base64_str}`
              tempMediaArr.push(item);
            }
          }
          
          setFiles(tempMediaArr);
        },
        loader: setIsLoading,
        data: {
          story: story_id,
        },
      });
    }

    return () => {};
  }, [access_token, storyData]);

  const partialUpdateMedia = (partialUpdateId, include_in_story=false) => {
    try {
      const formData = new FormData();
      formData.append('include_in_story', include_in_story);
      formData.append('flow', localStorage.getItem('flow'));
      formData.append('access_token', access_token);
      formData.append('session', JSON.parse(localStorage.getItem('sessionid')));
  
      createAuthRequest({
        setter: () => {
          window.location.reload()
        },
        loader: setIsLoading,
        data: formData,
        token: access_token,
        method: 'PATCH',
        url: `/api/storymedia/${partialUpdateId}/`,
      });
    } catch (error) {
      console.error({
        error,
      });
    }
  };

  async function getCompanyDetail(){
    
    const res = await axiosInstance({
      url: `/api/profileuser/${profileToUse}/`,
    })
    
    return res?.data?.company?.slug;
  }

  async function getTranslatedIntroMessage(message){
    let translate_api_url = 'api/ai4bharat/translate';
    try {
      const response = await axiosInstance.post(translate_api_url, {
        message_body: message,
        source_language: 'hi',
        target_language: languageToUse,
      });
      
      // Return the audio content
      return response.data.transcript;
    } catch (error) {
      console.error('Error fetching AI4Bharat audio:', error);
      throw error;
    }

  }

  useEffect(() => {
    const fetchBotInfo = async () => {
      
      setIsIntroLoading(true);
      let companyName = await getCompanyDetail();
      try {
        let filter_route = bot_routes.reflection;
        if (selectedType === 'normal') {
          if (localStorage.getItem('flow') && localStorage.getItem('flow') === 'login') {
            filter_route=bot_routes.normal
          } 
        } else {
          filter_route=bot_routes.oneshot
        }
        const response = await axiosInstance({
          url: company_bot_list_url,
          params: {
            company__slug: companyName,
            target_language: languageToUse,
            route: filter_route
          },
        });
        const bots = response?.data?.results;
        
  
        if (bots) {
          let storedRoute = '/';

          if (selectedType === 'oneshot'){
            storedRoute = '/oneshot_bot';
          } else {
            if(localStorage.getItem('flow') && localStorage.getItem('flow') === 'login'){
              storedRoute = '/';
            } else {
              storedRoute = '/reflection';
            }
          }
          
          let selectedBot = bots.find(bot => bot.route === storedRoute);
          if (!selectedBot) {
            selectedBot = bots[0] || { route: '/' };
          }
          localStorage.setItem('statemachine_length', selectedBot?.statemachine_length);
          setStateMachineLength(selectedBot?.statemachine_length)
          const botName = selectedBot?.name || 'Bot';
          localStorage.setItem('botName', botName);
          setBotNameToDisplay(botName);
        }
       
        if (!shouldFetchIntro || chatHistory?.length) return;
  
        if (languageToUse && bots && bots.length > 0) {
          let latestBot;
          for (const bot of bots) {
            if(isShikshalokamPublicType){
              let storedRoute = '/';
              if (selectedType === 'oneshot'){
                storedRoute = '/oneshot_bot';
              } else {
                if(localStorage.getItem('flow') && localStorage.getItem('flow') === 'login'){
                  storedRoute = '/';
                } else {
                  storedRoute = '/reflection';
                }
              }
              if (bot.route === storedRoute){
                latestBot = bot
              }
            }
            else if (!latestBot || new Date(bot.created_at) > new Date(latestBot.created_at)) {
              latestBot = bot;
            }
          }
          if (!latestBot) {
            handleFirstMessage('');
            return;
          }
          
          let message = latestBot.introductory_message;
          let firstName = JSON.parse(localStorage.getItem("first_name")) || '';
          if (message && firstName) {
            const words = message.split(' ');
            words.splice(1, 0, firstName);
            message = words.join(' ');
          }
          
          if (languageToUse !== 'hi'){
            message = await getTranslatedIntroMessage(message)
          }
          if (message && !!message?.trim() && (chatHistory[chatHistory?.length - 1]?.msg !== message)) {
            localStorage.setItem('intro_message', message);
            setSentences((prev) => [
              ...prev,
              {
                message: message,
                isNarrated: false,
                id: new Date().valueOf(),
              },
            ]);
          }
        } else {
          const message = response?.data?.introductory_message;
          if (message === null) {
            handleFirstMessage('');
            return;
          }
          if (!!message?.trim() && (chatHistory[chatHistory?.length - 1]?.msg !== message)) {
            localStorage.setItem('intro_message', message);
            setSentences((prev) => [
              ...prev,
              {
                message: message,
                isNarrated: false,
                id: new Date().valueOf(),
              },
            ]);
          }
        }
  
      } catch (error) {
        console.error({ error });
      } finally {
        setHasFetchIntro(true);
      }
    };
    
    
    if (chatHistory?.length === 0 && shouldFetchIntro && profileToUse) {

      fetchBotInfo().then(() => {
        setShouldFetchIntro(false);
        setIsIntroLoading(false);
      });
    }
    
    return () => {};
  }, [access_token, shouldFetchIntro, profileToUse, languageToUse]);

  //copying to local storage
  useEffect(() => {
    
    setLocalChatHistory(chatHistory);
    lastBotMessageIndex.current = chatHistory?.length - 1;
    if (!showFileInput) handleScrollToView();
  }, [chatHistory]);

  useEffect(() => {
    if(!isLoading && showFileInput && acceptedTnc!=="ONGOING"){
      endPageToScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading, showFileInput]);

  useEffect(() => {
    if (
      !!recordings?.length &&
      chatHistory[chatHistory?.length - 1]?.source !== "bot"
    ) {
        
        setChatHistory((prev) => {
        prev[chatHistory?.length - 1] = {
          ...prev[chatHistory?.length - 1],
          recording: recordings[recordings?.length - 1],
        };
        return prev;
      });
    }
    return () => {};
  }, [recordings, chatHistory]);

  // sends data on trigger
  useEffect(() => {
    try {
      if (!!trigger && !!reconText) {
        // sendData(reconText);
        setReconText("");
        setTrigger(false);
      }
    } catch (error) {
      console.error({ error });
    }
  }, [chatSocket, reconText, trigger, recordings]);

  useEffect(() =>{
    localStorage.setItem('showHomepage', JSON.stringify(showHomepage));
  }, [showHomepage])

  useEffect(() => {
    if(audioRef?.current){
      if(isMute){
        audioRef.current.muted = true
      }else{
        audioRef.current.muted = false
      }
    }
  }, [isMute])

  useEffect(()=>{
    if(!isModalOpen && profileToUse){
      const titleTime = setTimeout(()=>{
        if(shouldShowChatHistoryFeature) showChatTitle();
      }, 4000);
  
      return ()=>{
        clearTimeout(titleTime);
      }
    }
  },[profileToUse, isModalOpen])


  useEffect(() => {
    localStorage.setItem('isChatVisible', JSON.stringify(isChatVisible));
  }, [isChatVisible]);

  const handleScrollToView = () => {
    if(acceptedTnc==="ONGOING") return;
    try {
      document?.querySelector("#last-chat-boundary")?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error({ error });
    }
  };

  async function handleChatSessionButtonClick({key}){
    lastBotMessageIndex.current = -1;
    let key_num;
    let currentSession;
    if(key){
      key_num = key?.split('-').pop();
      currentSession = chatTitle[key_num]?.session;
      localStorage.setItem('isOldChatOpen', JSON.stringify(true));
      localStorage.setItem('isNewChatOpen', JSON.stringify(false));
      localStorage.setItem('sessionid', JSON.stringify(currentSession))
      localStorage.setItem('chat-history', JSON.stringify([]));
      window.location.reload()
    } else {
      currentSession = JSON.parse(localStorage.getItem('sessionid'));
      handleCompanyChatCall(currentSession);
    }
  }

  const pdfDownloadSidebar = async (sessionid) => {
    try {
        setIsLoading(true);
        setIsPdfDownloading(true);
        
        
        // Fetch story by session ID
        const story = await getStoryBySession(sessionid, access_token);
        
        const story_media = story[0]?.story_media;
        const pdfMedia = story_media?.filter(media => media.media_type === 'application/pdf') || [];
        
        
        const pdfFileName = pdfMedia[0]?.name;
        const fileUrl = pdfMedia[0]?.public_url;

        if (fileUrl && pdfFileName) {
            const response = await fetch(fileUrl);
            

            if (response.ok) {
                const reader = response.body.getReader();
                const chunks = [];

                // Read the stream and push chunks to array
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }

                // Create a Blob from the chunks
                const blob = new Blob(chunks);
                const a = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = pdfFileName;
                document.body.appendChild(a);
                a.click();

                // Cleanup
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Network response was not ok.');
            }

        } else {
            console.error('No PDF media found or invalid file URL.');
        }

    } catch (error) {
        console.error('Error downloading file:', error);
    } finally {
        setIsPdfDownloading(false);
        setIsLoading(false);
    }
  }


  async function getCompanyChatApi(currentSession) {
    const resp = await axiosInstance({
      url: `/api/companychat/?session=${currentSession}`,
    });
    return resp
  }

  async function handleCompanyChatCall(currentSession) {  
    const storedChatHistory = JSON.parse(localStorage.getItem('chat-history'));
    if (storedChatHistory.length >= 1) {
      return;
    }

    setIsLoading(true);
    setIsFetchingOldIntro(true);

    try {
        const resp = await getCompanyChatApi(currentSession);

        const newChatSessionDetail = [];
        
        let sortedResult = quickSort(resp?.data?.results, compareById);

        // Ensure intro message is added only once
        if (introMessageRef.current) {
            const temp_intro = introMessageRef.current;
            setSentences((prev) => [
                ...prev,
                {
                    message: temp_intro,
                    source: 'bot',
                    isNarrated: true,
                    id: 'intro_msg_id',
                },
            ]);

            newChatSessionDetail.push({
                msg: temp_intro,
                source: 'bot',
                updated_at: 'intro_msg_id',
            });

            introMessageRef.current = ""; // Clear intro message after use
        }

        // Process chat messages
        sortedResult.forEach((chats) => {
            let messageToUse = chats?.message;
            if (chats?.translated_message && chats?.translated_message !== ''){
              messageToUse = chats?.translated_message;
            }
            const chatMessage = {
                message: chats?.sender?.id === 1 ? messageToUse : chats?.message,
                source: chats?.sender?.id === 1 ? 'bot' : 'user',
                isNarrated: true,
                id: chats?.id,
            };

            setSentences((prev) => [
                ...prev,
                chatMessage,
            ]);

            newChatSessionDetail.push({
                msg: chats?.sender?.id === 1 ? messageToUse : chats?.message,
                source: chats?.sender?.id === 1 ? 'bot' : 'user',
                updated_at: chats?.id,
            });
        });

        // Update chat history
        const newChatHistoryItems = newChatSessionDetail.map((item) => ({
            msg: item.msg,
            source: item.source,
            updated_at: item.updated_at,
        }));
        
        // Avoid adding duplicates
        
        setChatHistory((prev) => {
            const existingMessages = new Set(prev.map(msg => msg.msg));
            const filteredItems = newChatHistoryItems.filter(item => !existingMessages.has(item.msg));
            return [
                ...prev,
                ...filteredItems,
            ];
        });

        lastBotMessageIndex.current += newChatSessionDetail.length;
        
    } catch (error) {
        console.error('Error fetching company chat data:', error);
    } finally {
        setIsLoading(false);
        setIsFetchingOldIntro(false);
    }
  }

  function compareById(a, b) {
    return a.id - b.id;
  }

  function compareByIdDesc(a, b) {
    return b.id - a.id;
  }

  function quickSort(arr, compare) {
    if (arr?.length <= 1) {
        return arr;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr?.length; i++) {
        if (compare(arr[i], pivot) < 0) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left, compare), pivot, ...quickSort(right, compare)];
  }

  async function showChatTitle(){
    try{
      const currentSessionID = JSON.parse(localStorage.getItem('sessionid'));
      let sessionComplete;
      const TitleAndSession = [];
      const response = await axiosInstance({
        url: `/api/chatsession?profile=${profileToUse}`,
      })
      
      if (response) {
        let sortedResult = quickSort(response?.data?.results, compareByIdDesc);
        sortedResult.forEach((sessionObj, index)=>{
          const status = sessionObj.session_status?.toLowerCase() === 'completed' ? completedStatusText: inProgressStatusText;
          TitleAndSession.push({ session: sessionObj.session, title: sessionObj.title, sessionStatus: status });
          if (sessionObj.session === currentSessionID) {
            sessionComplete = sessionObj.session_status?.toLowerCase() === 'completed';
          }
        })
        setShowFileInput(sessionComplete === true);
        setSessionTitleDetail(TitleAndSession);
        setChatTitle([...TitleAndSession.slice(0, chatToAddLength)]);
      }
    } catch (error){
      
    } finally{
      setIsLoading(false);
    }

  }

  const fetchMoreData = () => {
    setTimeout(()=>{
      if (visibleItemCount < sessionTitleDetail.length) {
        setVisibleItemCount(prevCount => prevCount + chatToAddLength);
        setChatTitle(prevChatTitle => [
          ...prevChatTitle,
          ...sessionTitleDetail.slice(prevChatTitle.length, prevChatTitle.length + chatToAddLength)
        ]);
      }
    }, 1000)
  };

  function showScrollbarContent(){
    return(
      <div
        className={isMobile? 'div1': 'div2'}
      >
      <InfiniteScroll
        dataLength={visibleItemCount}
        next={fetchMoreData}
        hasMore={visibleItemCount < sessionTitleDetail?.length}
        loader={
          <div
            className={isMobile? 'div3': 'div4'}
          >
            <BiLoader className="rotate-loader loader-icon" />
          </div>
        }
        scrollableTarget="shikshaScrollableDiv"
      >
        {chatTitle.map((item, index) => (
          <div
            key={`session-title-bttn-${index}`}
            className="chat-title-div div5"
          >
            <div
              className='div6'
              onClick={() => {
                handleChatSessionButtonClick({ key: `session-title-bttn-${index}` });
              }}
            >
              <span
                className="span1"
              >
                {item?.title}
              </span>
              <span
                className={`span2 ${(item?.sessionStatus === completedStatusText) ? 'span3' :'span4'}`}
              >
                {item?.sessionStatus}
              </span>
            </div>

            {(item?.sessionStatus === completedStatusText)&& <button
              className="span5"
              onClick={() => {
                

                pdfDownloadSidebar(item?.session)
              }}
            >
              <FiDownload />
            </button>}
            {(item?.sessionStatus !== completedStatusText)&& <button
              className="span5"
            >
            </button>}
          </div>
        ))}
      </InfiniteScroll>
      </div>
    );
  }

  const handleSendMessage = useCallback(
    (event) => {
      try {
        
        setIsChatVisible(true);
        setShowHomepage(false);
        setNotMute(true);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        if (!!event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!textMessage.trim()) return;  // Only send if there's a typed message
        
        if (textMessage.trim()) {
          handleMessagesForUser(textMessage);  // Send the typed message
          chatSocket.send(
            JSON.stringify({
              text: textMessage,  // Only send the textMessage
              context: "",
            })
          );
          handleScrollToView();
          setTextMessage("");  // Clear textMessage after sending
        }
      } catch (error) {
        console.error({ error });
      }
    },
    [chatSocket, textMessage]
  );

  const handleOnInputText = (e) => {
    e.preventDefault();
    setTextMessage(e.target.value);
    
    // If the input is cleared, reset the recognition flags
    if (e.target.value.trim() === "") {
      setIsRecognizing(false);
      setHasStartedListening(false);
    }
  };
  
  const handleMessagesForBot = useCallback(
    (sentence) => {
      if (isRecognizing || hasStartedListening || !shouldSendMessage) return;
      
      const lastMessage = chatHistory[chatHistory?.length - 1];
      if (lastMessage?.msg === sentence && lastMessage?.source === "bot") {
        
        return;
      }

      if (chatHistory[chatHistory?.length - 1]?.source === "bot") {
        
        setChatHistory((prevMessages) => {
          const lastMessage = prevMessages[prevMessages?.length - 1];
          lastMessage.msg += " " + sentence;
          return [...prevMessages];
        });
      } else {
        
        setChatHistory((prevMessages) => {
          return [
            ...prevMessages,
            createMessage({
              msg: sentence,
              source: "bot",
            }),
          ];
        });
      }
    },
    [chatHistory]
  );

  const handleMessagesForUser = useCallback((sentence) => {
      setChatHistory((prevMessages) => [
      ...prevMessages,
      createMessage({
        msg: sentence,
        source: "user",
      }),
    ]);
  }, []);

  async function getAI4BharatAudio(text, sourceLanguage = 'en', gender = 'female') {
    try {
      const response = await axiosInstance.post('/api/ai4bharat/', {
        text: text,
        source_language: sourceLanguage,
        gender: gender,
      });
      
      // Return the audio content
      return response.data.audio;
    } catch (error) {
      console.error('Error fetching AI4Bharat audio:', error);
      throw error;
    }
  }


  const handleAI4BharatTTSRequest = async (text, id, sourceLanguage) => {
    try {
  
      let cachedAudioUrl = audioCache[id];
      let audio_result = "";
      let audio;
  
      // Mark sentence as narrated if override ID is not set
      if (!hasOverRideId) {
        handleMessagesForBot(text);
      }
  
      // If muted, mark all sentences as narrated and skip TTS
      if (isMute && !hasOverRideId) {
        setSentences((prev) => {
          let all_sentences = JSON.parse(JSON.stringify([...prev]));
          return all_sentences.map((x) => ({ ...x, isNarrated: true }));
        });
        setIsNextAllowed(true);
        setHasOverRideId(null);
        return;
      }
  
      // Fetch the audio result using AI4Bharat TTS service if not cached
      if (!cachedAudioUrl) {
        audio_result = await getAI4BharatAudio(text, sourceLanguage);
        if (audio_result?.length) {
          cachedAudioUrl = `data:audio/wav;base64,${audio_result}`;
          setAudioCache((prevCache) => ({
            ...prevCache,
            [id]: cachedAudioUrl,
          }));
        }
      }
  
      if (cachedAudioUrl) {
        audioRef.current = new Audio(cachedAudioUrl);
        audio = audioRef.current;
  
        // Disable next sentence narration while current audio is playing
        audio.onplay = () => {
          setIsNextAllowed(false);
        };
  
        // Enable next sentence narration after the current audio ends
        audio.onended = () => {
          setSentences((prev) => {
            let all_sentences = JSON.parse(JSON.stringify([...prev]));
            let index = prev.findIndex((x) => x.id === id);
            if (index > -1) all_sentences[index].isNarrated = true;
            return all_sentences;
          });
          setIsNextAllowed(true);
          setHasOverRideId(null);
        };
  
        try {
          await audio.play();
        } catch (error) {
          console.error('Error playing audio:', error);
          setSentences((prev) => {
            let all_sentences = JSON.parse(JSON.stringify([...prev]));
            let index = prev.findIndex((x) => x.id === id);
            if (index > -1) all_sentences[index].isNarrated = true;
            return all_sentences;
          });
          setIsNextAllowed(true);
          setHasOverRideId(null);
        }
      }
    } catch (error) {
      console.error('Error in handleAI4BharatTTSRequest:', error);
    }
  };

  async function ai4BharatASR(base64, gender = 'female'){
    
    let sourceLanguage = languageToUse;
    try {
      const response = await axiosInstance.post('/api/ai4bharat/asr', {
        base_64: base64,
        source_language: sourceLanguage,
        gender: gender,
      });
      
      // Return the audio content
      return response.data.transcript;
    } catch (error) {
      console.error('Error fetching AI4Bharat audio:', error);
      throw error;
    } 
  }


  const isTyping = !!textMessage.trim();

  useEffect(() => {
    let unnarratedMessages = sentences.filter((x) => !x?.isNarrated);
    let hasUnnarratedMessages = !!unnarratedMessages?.length;
    let sourceLanguage = languageToUse;

    if (isNextAllowed && hasUnnarratedMessages) {
      handleAI4BharatTTSRequest(
        unnarratedMessages[0].message,
        unnarratedMessages[0].id,
        sourceLanguage
      )
    }

    return () => {};
  }, [isNextAllowed, sentences, languageToUse]);

  useEffect(() => {
    if (
      !!appendix?.length &&
      chatHistory[chatHistory?.length - 1].source === "bot"
    ) {
        
        setChatHistory((prevMessages) => {
        const lastMessage = prevMessages[prevMessages?.length - 1];
        lastMessage.appendixURL = appendix;
        lastMessage.hasAppendix = true;
        return [...prevMessages];
      });
      setAppendix([]);
    }
    return () => {};
  }, [appendix, chatHistory]);

  const handleFirstMessage = ({ message, category }) => {
    try {
      if (category === "special") {
        window.location.reload();
        return;
      }
      handleScrollToView();
    } catch (error) {
      console.error({ error });
    }
  };

  const handleOnSpeaking = async (text, id, staticMsg) => {
    try {
      try {
        if (!!audioRef.current) await audioRef.current.pause();
      } catch (error) {
        console.error({ error });
      }
      setHasOverRideId(id);
      setIsNextAllowed(true);
      const messageToPlay = staticMsg? staticMsg: chatHistory.find((message) => message.updated_at === id);
      setSentences((prev) => {
        return [
          {
            message: messageToPlay?.msg,
            isNarrated: false,
            id: id,
          },
        ];
      });
    } catch (error) {
      console.error({ error });
    }
  };

  const handleOnStopSpeaking = async () => {
    try {
      try {
        if(audioRef.current) await audioRef.current.pause();
      } catch (error) {
        console.error({ error });
      }
      setHasOverRideId(null);
      setSentences([]);
      setIsNextAllowed(true);
    } catch (error) {
      console.error({ error });
    }
  };

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
  
          // Clear previous audio chunks before starting new recording
          const localAudioChunks = [];
  
          recorder.start();
          setHasStartedRecording(true);
          
  
          recorder.ondataavailable = (event) => {
            // Collect audio data chunks in the local array
            localAudioChunks.push(event.data);
            
          };
  
          recorder.onstop = async () => {
            
            if (localAudioChunks.length > 0) {
              // Combine all audio chunks into a single Blob
              const audioBlob = new Blob(localAudioChunks, { type: 'audio/webm;codecs=opus' });
              
  
              // Check if the audio blob contains any significant sound
              const wavBlob = await convertToWav(audioBlob);
              if (!wavBlob) {
                
                return; // Skip if no meaningful audio
              }
              setIsFetchingData(true);
              // Convert to Base64 and send to the ASR API
              const base64Audio = await convertBlobToBase64(wavBlob);
              const transcriptResult = await ai4BharatASR(base64Audio);
              // Update transcript if valid audio
              setTextMessage(transcriptResult);
              setIsFetchingData(false);
            } else {
              console.warn("No audio chunks were recorded.");
              setIsFetchingData(false);
            }
          };
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
          setIsFetchingData(false);
        });
    } else {
      console.warn("getUserMedia not supported on your browser!");
    }
  };
  
  // Function to check if the audio contains significant sound
  const containsSignificantAudio = (audioBuffer, threshold = 0.3) => {
    const numOfChannels = audioBuffer.numberOfChannels;
    const channelData = [];
  
    for (let i = 0; i < numOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i));
    }
  
    // Check each sample in each channel for significant sound
    for (let i = 0; i < channelData[0].length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        if (Math.abs(channelData[channel][i]) > threshold) {
          return true; // There is significant sound
        }
      }
    }
  
    return false; // No significant sound detected
  };
  
  // Function to convert the audio to WAV and check for silence
  const convertToWav = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioData = new Uint8Array(reader.result);
  
        try {
          const buffer = await audioContext.decodeAudioData(audioData.buffer);
          
          // If no significant audio is detected, return null
          if (!containsSignificantAudio(buffer)) {
            resolve(null);
          } else {
            // Convert to WAV and return the blob if audio is valid
            const wavData = bufferToWave(buffer, buffer.length);
            const wavBlob = new Blob([wavData], { type: 'audio/wav' });
            resolve(wavBlob);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(audioBlob);
    });
  };
  // Function to convert audio buffer to WAV format
  const bufferToWave = (abuffer, len) => {
    const numOfChannels = abuffer.numberOfChannels;
    const sampleRate = abuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16; // 16-bit PCM
    const byteRate = sampleRate * numOfChannels * (bitDepth / 8);
    const blockAlign = numOfChannels * (bitDepth / 8);
    const wavLength = 44 + len * blockAlign;
    const buffer = new ArrayBuffer(wavLength);
    const view = new DataView(buffer);
  
    // Write WAV header
    let offset = 0;
    const writeString = (str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i) & 0xff);
      }
      offset += str.length;
    };
  
    // RIFF header
    writeString('RIFF');
    view.setUint32(offset, wavLength - 8, true); // file length
    offset += 4;
    writeString('WAVE'); // wave format
  
    // Format chunk
    writeString('fmt ');
    view.setUint32(offset, 16, true); // chunk length
    offset += 4;
    view.setUint16(offset, format, true); // format type
    offset += 2;
    view.setUint16(offset, numOfChannels, true); // channels
    offset += 2;
    view.setUint32(offset, sampleRate, true); // sample rate
    offset += 4;
    view.setUint32(offset, byteRate, true); // byte rate
    offset += 4;
    view.setUint16(offset, blockAlign, true); // block align
    offset += 2;
    view.setUint16(offset, bitDepth, true); // bits per sample
    offset += 2;
  
    writeString('data');
    view.setUint32(offset, len * blockAlign, true);
    offset += 4;
  
    for (let i = 0; i < len; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = abuffer.getChannelData(channel)[i];
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
  
    return view;
  };
  
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop the recording
      setHasStartedRecording(false);
      
    }
  };

  function downloadPdf(){
    let storedState = localStorage.getItem('state');
    let storedCompany = localStorage.getItem('company');
    let current_company = storedCompany? JSON.parse(storedCompany) : null;
    let currentState = storedState? JSON.parse(storedState) : null;
    if (!currentState) {
      currentState = cookies.get('state');
    }
    if(!current_company){
      current_company = cookies.get('company');
    }
    

    return (
      <>
        <PdfDownloader 
          key={new Date().getTime()}
          storyData={storyData} 
          isShikshalokam={true} 
          downloadTriggered={triggerDownload}
          handleDownloadStop={handleDownloadStop}
          storyMediaArr={files}
          currentState={currentState}
          current_company={current_company}
        />
      </>
    );
  }

  const handleSelectedTypeNameChanges = (e)=>{
    let { value } = e?.target;
    if(value==="") value = selectedLabel?.types[0]?.value;
    localStorage.setItem('selected_type', JSON.stringify(value))
    ResetChat(e);
  }

  function handleAcceptTnC() {
    
    localStorage.setItem('has_accepted_tnc', true)
    setAcceptedTnC(true);
  }

  function handleDeclineTnC() {
    
    localStorage.setItem('has_accepted_tnc', false)
    setAcceptedTnC(false);
    // navigate(ROUTES.SHIKSHALOKAM_VOICE_CHAT_LOGIN);
    navigate(-1)
  }

  return (
    <>
      {(acceptedTnc==="ONGOING" && !isLoading)&& <PrivacyPolicyPage tncText={t('tncText')} onAccept={handleAcceptTnC} onDecline={handleDeclineTnC} />}
      <></>
      <div className={`div27 ${isOpen&& ' div70'} ${(projectId)&& ' div21'}`}>
        <div className={`div28 ${isOpen ? "div29" : ""}`}>
          {(isShikshalokamPublicType)&& <Sidebar
            isOpen={isOpen}
            toggle={setIsOpen}
            isMobileFirst={true}
            showScrollbarContent={showScrollbarContent}
            resetChat={ResetChat}
            setIsResetCalled={setIsResetCalled}
            languageToUse={languageToUse}
          />}
        </div>
        {isOpen && (
          <div
            className="div7"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        <div className={isMobile? 'div30_a': 'div30'}>
          <MainHeader
            isMobileFirst={isMobile}
            showTheDots={false}
            content={
              <>
                <CustomFormData layOut={2} selectID="selectedTypeID" selectName="selectedType"
                  selectOptions={selectedLabel.types}  
                  selectValue = {selectedType}
                  selectClassName="div31"
                  selectOnChange={handleSelectedTypeNameChanges}
                  showDefaultDropdownText={false}
                />
                <button
                  onClick={async (e) => {
                    setIsResetCalled(true);
                    await ResetChat(e)
                  }}
                  className="div32"
                >
                  <div
                    className="div8"
                  >
                    +
                  </div>
                  {/* <GoPlusCircle className="text-3xl mr-1  text-black-400"  /> */}
                </button>
              </>
            }
          />
        </div>
      </div>
      {(isLoading || isIntroLoading)&& <div className="loader-load-spinner">
        <div className="div67">
          <BiLoader className="loader-rotate-loader loader-icon" />
          {isPdfDownloading&& 
            <div className="div68">
              <label className="form-label label1">{t('downloadLoader')}</label>
            </div>
          }
          {isEndStoryLoading&& 
            <div className="div69">
              <label className="form-label label1">{t('storyLoader')}</label>
            </div>
          }
        </div>
      </div> }
      <div className={`${projectId? 'div72' : isOpen? 'div71': ''}`}>
       {(projectId)&& 
        <>
            <button
              onClick={(e) => {
                if (projectId){
                  clearFromStorage()
                  navigate(-1)
                  // window.location.href=ROUTES.EXIT_ROUTE;

                }
              }}
              className="button-13"
            >
              <div
              >
                {t('doLater')}
              </div>
            </button>
          </>
        }
        <HiddenRecorder />
        <div
          className={`${projectId? 'div33-a': 'div33'} div9`}
        >
          {(!showHomepage)&&
            <ul className="div34">
              {chatHistory?.map((chat, i) => (
                <li
                key={i}
                className={`div34 div35 ${
                  chat?.source === "user" ? "label1" : "label1"
                }`}  // Align messages based on the source
              >
        
                <div className={`div36 ${chat?.source === "user"&& 'div37'}`}>
                  <ChatMessage
                    botNameToDisplay={botNameToDisplay}
                    userType={chat?.source}
                    message={`${chat?.msg}`}
                    name={"You"}
                    recording={chat?.recording}
                    hasAppendix={chat?.recording}
                    appendixURL={chat?.appendixURL}
                    isTalking={
                      (chat.source === "bot") && !isStreamingComplete && (i === chatHistory.length - 1)
                    }
                    handleOnStopSpeaking={() => handleOnStopSpeaking()}
                    handleOnSpeaking={() =>{
                      handleOnSpeaking(chat?.msg, chat?.updated_at)}
                    }
                    isAnyPlaying={!!hasOverRideId || isTalking}
                    isPlaying={hasOverRideId === chat?.updated_at}
                    isStreamingComplete={isStreamingComplete}
                    setNotMute={setNotMute}
                    chatId={chat?.updated_at}
                  />
                  </div>
                  {!hasStartedListening && chatHistory[chatHistory?.length - 1].source === "user" &&
                  i === chatHistory?.length - 1 ? (
                    <div className="div57">
                      <div className="div58">
                        <div>{t('replyMsg')}</div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </li>
              ))}
            </ul>
          }
          {(showHomepage)&&
            <>
              {(localStorage.getItem('flow'))&&<>
                <div className="div10" >
                  <h3 className="h3-1">
                    {t('homepageHeading')}
                    <br/>
                    {t('homepageHeading1')}
                  </h3>
                </div>
                <ul className="div11" >
                  <li>{t('homepageList')}</li>
                  <li>{t('homepageList1')}</li>
                  <li>{t('homepageList2')}</li>
                </ul>
              </>}

              {chatHistory?.length > 0 && (
                <div className="div26">
                  <div className="div36 div12" >
                    <ChatMessage
                      botNameToDisplay={botNameToDisplay}
                      userType={chatHistory[0]?.source}
                      message={`${chatHistory[0]?.msg}`}
                      name={"You"}
                      recording={chatHistory[0]?.recording}
                      hasAppendix={chatHistory[0]?.recording}
                      appendixURL={chatHistory[0]?.appendixURL}
                      isTalking={false}
                      handleOnStopSpeaking={() => handleOnStopSpeaking()}
                      handleOnSpeaking={() =>{
                        handleOnSpeaking(chatHistory[0]?.msg, chatHistory[0]?.updated_at)}
                      }
                      isAnyPlaying={!!hasOverRideId || isTalking}
                      isPlaying={hasOverRideId === chatHistory[0]?.updated_at}
                      isStreamingComplete={isStreamingComplete}
                      setNotMute={setNotMute}
                      chatId={chatHistory[0]?.updated_at}
                    />
                  </div>
                </div>
              )}
            </>
          }
          {(isStreamingComplete && showFileInput && !showHomepage && !isEndStoryLoading && (
            !isLoading || isPdfDownloading ) && storyData?.id !== '') && (
            <>
              <div className="div13" >
                <ChatMessage 
                  botNameToDisplay={botNameToDisplay}
                  userType="bot"
                  message={t('evidence')}
                  // message="क्या आप परियोजना में साक्ष्य जोड़ना चाहेंगे?"
                  isTalking={false}
                  handleOnStopSpeaking={() => handleOnStopSpeaking()}
                  handleOnSpeaking={(message, updatedAt, staticMessage) =>{
                    const message_to_use = t('evidence')
                    handleOnSpeaking(message_to_use, "upload-img-id",
                      {msg: message_to_use, updated_at: "upload-img-id", source:"bot"}
                    )}
                  }
                  isAnyPlaying={!!hasOverRideId || isTalking}
                  isPlaying={hasOverRideId === "upload-img-id"}
                  isStreamingComplete={isStreamingComplete}
                  setNotMute={setNotMute}
                  chatId={"upload-img-id"}
                  isStaticMessage={true}
                />
                <div className="div14">
                  <label className="clickable-label" htmlFor="file-upload">
                    <GrGallery className="icon-1" />
                    <span className="div16">
                      {t('upload')}
                    </span>
                    <input 
                      id="file-upload"
                      type="file" 
                      accept="image/*,image/svg+xml" 
                      multiple
                      onChange={handleFileUpload} 
                      // onClick={(e) => {
                      //   if (files?.length >= 5) {
                      //     setFileErrorText(fileExceedText);
                      //   } else {
                      //     setFileErrorText('');
                      //   }
                      // }}
                      disabled={isLoading || (fileErrorText !== '' && fileErrorText !== fileSizeText && fileErrorText === fileExceedText)}
                      className="div17"
                    />
                  </label>
                </div>

                {files?.length > 0 && (
                  <div className="div18">
                    <h4 className="h4-1">{t('uploadedFiles')}:</h4>
                    <ul>
                      {fileErrorText && (
                        <li className="li-1">
                          {fileErrorText}
                        </li>
                      )}
                      {files.map((file, index) => (
                        <li key={index} className="li-2">
                          {file.name.slice(0, 20)}
                          {file.name.length > 20 && '...'} 
                          <button 
                            className="button-1" 
                            onClick={() => partialUpdateMedia(file?.id)}
                          >
                            <RxCross2 />
                          </button>
                        </li>
                      ))}
                      {isUploading && (
                        <li className="li-3">
                          {t('uploadLoadMsg')}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="div19">
                <ChatMessage 
                  botNameToDisplay={botNameToDisplay}
                  userType="bot"
                  message={t('storyText')}
                  isTalking={false}
                  handleOnStopSpeaking={() => handleOnStopSpeaking()}
                  handleOnSpeaking={(message, updatedAt, staticMessage) =>{
                    const message_to_use = t('storyText')
                    handleOnSpeaking(message_to_use, "download-story-id",
                      {msg: message_to_use, updated_at: "download-story-id", source:"bot"}
                    )}
                  }
                  isAnyPlaying={!!hasOverRideId || isTalking}
                  isPlaying={hasOverRideId === "download-story-id"}
                  isStreamingComplete={isStreamingComplete}
                  setNotMute={setNotMute}
                  chatId={"download-story-id"}
                  isStaticMessage={true}
                />
                {(!projectId)&& <div className="div20">
                  <button
                    className="clickable-button"
                    onClick={()=>{
                      const sessionToUse = JSON.parse(localStorage.getItem('sessionid'));
                      if (sessionToUse) {
                        pdfDownloadSidebar(sessionToUse);
                      }
                    }}
                    disabled={isLoading || isPdfDownloading}
                  >
                    <div className="download-story-div">
                      <FiDownload className="icon-1" />
                      <span className="div16" ref={endPageToScrollRef}>
                      {t('downloadStoryText')}
                      </span>
                    </div>
                  </button>

                  {triggerDownload && isPdfDownloading && !isLoading && downloadPdf()}
                </div>}
                <div className="div20">
                  <button
                    className="clickable-button"
                    onClick={openModal}
                    disabled={isLoading || isPdfDownloading}
                  >
                    <div className="download-story-div">
                      <MdEdit className="icon-1" />
                      <span className="div16" ref={endPageToScrollRef}>
                      {t('editStoryText')}
                      </span>
                    </div>
                  </button>
                </div>
                {/* {(triggerDownload)&& <Progressbar
                    progressInNumber={downloadProgress?.toFixed(2)}
                    progressBarClass="w-[273px] progress-div-download"
                  />} */}
              </div>
              {(isModalOpen && storyData )&& handleEditClick()}
            </>
          )}
          <div id="last-chat-boundary" className="div38" />
        </div>
        {(!showFileInput && !isLoading)&&       
          <form
            className="div39 form-1"
            onSubmit={handleSendMessage}
            autoComplete="off"
          >
            <div
              className="textarea-wrapper"
            >
              <textarea
                className="input-2 input-1"
                onChange={handleOnInputText}
                placeholder={hasStartedRecording? 
                  t('placeholder1'): 
                  isFetchingData? t('placeholder2'): t('placeholder3')
                }
                name="message-box"
                value={textMessage}
                autoFocus={true}
                disabled={hasStartedRecording || isFetchingData}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.shiftKey) {
                      // Submit the form on Shift + Enter
                      e.preventDefault(); // Prevent default "Enter" key behavior
                      e.target.form.requestSubmit();
                      setTimeout(() => {
                        e.target.value = "";
                      }, 0);
                    } else {
                      
                    }
                  }
                }}
              />
            </div>
            {(isTyping && !hasStartedListening) ? (
            <button
              type="submit"
              disabled={hasStartedRecording || isFetchingData}
              className="button-6"
            >
              <MdSend />
            </button>
            ) : (
              <div className="audio-recorder">
                {/* Recording Button */}

                {hasStartedRecording && (
                  <button
                    type="button"
                    onClick={() => {
                      stopRecording();
                    }}
                    className="div40"
                  >
                    {t('cancel')}
                  </button>
                )}

                <button
                  type="button"
                  onClick={hasStartedRecording ? stopRecording : startRecording}
                  disabled={isFetchingData}
                  className={`button-7 ${hasStartedRecording ? 'button-8' : 'button-9'}`}
                >
                  
                  {hasStartedRecording ? <FaMicrophone /> : <FaMicrophone />}
                </button>                
              </div>
            )}
          </form>
        }
      </div>
    </>
  );
};

export default ShikshalokamVoiceBasedChat;

function ChatMessage({
  userType,
  message,
  name,
  recording,
  appendixURL,
  isTalking,
  handleOnSpeaking,
  handleOnStopSpeaking,
  isPlaying,
  botNameToDisplay,
  isStreamingComplete,
  setNotMute,
  chat,
  staticMessage,
  chatId,
}) {

  let sanitizedContent = DOMPurify.sanitize(message);
  return (
    <div className="div41">
      {(userType === "bot")&& <div className="div42">
        <div
          className={`${
            userType === "bot" ? "div43" : "div44"
          } div45`}
        >
          <MdAccountCircle />
        </div>
        <div className="div46">
          {userType === "bot" ? (
            isPlaying ? (
              <button
                className={`button-10 button-3`}
                onClick={handleOnStopSpeaking}
                disabled={!isStreamingComplete}
              >
                <HiMiniSpeakerWave />
              </button>
            ) : (
              <button
                className={`button-11 button-3`}
                onClick={() => {
                  setNotMute(false);
                  handleOnSpeaking(message, chat?.updated_at, staticMessage);
                }}
                disabled={!isStreamingComplete}
              >
                <HiMiniSpeakerXMark />
              </button>
            )
          ) : null}
        </div>
      </div>}
      <div className={`${userType==='user'? 'div47': 'div48'}`}>
        <div
          className={`div36 ${(userType==='user')&& 'div37'}`}
        >
          {(userType === "user")&& <div
          className={`div49`}
        >
          <MdAccountCircle />
        </div>}
          {userType === "bot" ? botNameToDisplay : name}
        </div>
        {!!message && !!recording && (
          <div
            className={` ${
              userType === "bot" ? "div53" : "div54"
            } div50`}
          >
            <WaveSurferPlayer
              url={recording?.result}
              {...default_wave_surfer_config}
            />
          </div>
        )}
        <div
          className={` ${
            userType === "bot" ? "div53" : "div54"
          } div52 custom-voice-chat-chats`}
          id={chatId}
        >
            <ReactMarkdown  children={sanitizedContent} remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]} 
            />
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */


export function clearFromStorage() {
  const keysToRemove = [
    'botName', 'chat-history', 'company', 'first_name', 'has_accepted_tnc', 'intro_message', 
    'isChatVisible', 'isNewChatOpen', 'isOldChatOpen', 'profileid', 'route', 'sessionid', 'showFileInput', 
    'showHomepage', 'state'
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}
