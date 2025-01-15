import React, { useEffect, useMemo, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { createStoryMedia, getStoryAllMedia, getStoryById, partialUpdateStoryById, updateStoryMedia } from "../api.service";
import html2pdf from "html2pdf.js";
import axiosInstance from "../../../utils/axios";
import { useUserStore } from "../../../context/user";
import ROUTES from "../../../url";
import StorySecondPage from "./StorySecondPage";
import StoryThirdPage from "./StoryThirdPage";
import StoryFirstPage from "./StoryFirstPage";
import StoryFifthPage from "./StoryFifthPage";
import Cookies from "universal-cookie";
import getConfiguration, { company_list } from "../../../configure";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PdfDownloader = ({ storyData, isShikshalokam, downloadTriggered, handleDownloadStop, storyMediaArr, currentState, current_company}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contentPDF, setContentPDF] = useState({
        content1: "",
        content2: "",
        tweetContent: "",
        companyLogo: "",
    });
      const [userData, setUserData] = useState({
        authorName: '',
        organization: '',
        address: ''
    });
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState({
      response: "",
      status: 200,
    });
    const [pages, setPages] = useState([]);
    const [storyMediaIdArray, setStoryMediaIdArray] = useState(null);
    const downloadTriggeredRef = React.useRef(false);

    const pdfRef = React.useRef();
    const count = React.useRef(0);
    const imagesPerPage = 2;

    const cookie = new Cookies();
    const accessToken = useMemo(() => {
      const token = cookie.get('access_token');
      return token !== undefined && token !== null ? token : null;
    }, []);

    useEffect(() => {
      if(!storyData || !storyMediaIdArray) return;
      console.log("Child Story Data: ", storyData);

      if(storyData && storyData?.formatted_content){
        wordCounter(storyData);
        tweetCounter(storyData);
      }
      return () => {
  
      }
    }, [storyData, storyMediaIdArray])

    useEffect(()=>{
      if(!storyMediaArr) return;
      try {
          setStoryMediaIdArray(storyMediaArr);
      } catch (error) {
        console.log('Error: ', error);
      }
    }, [storyMediaArr])

    useEffect(() => {
      if (!storyMediaIdArray || !imagesPerPage) return;
      setPages([]);
      let images;
      storyMediaIdArray? images = storyMediaIdArray.map((y) => y?.base64_str) : images = []
      let remainingImages = images;
      while (remainingImages?.length > 0) {
        const currentPageImages = remainingImages?.slice(0, imagesPerPage);
        setPages((prevPages) => [...prevPages, currentPageImages]);
        remainingImages = remainingImages?.slice(imagesPerPage);
      }
    }, [storyMediaIdArray, imagesPerPage]);

    useEffect(() => {
      if (downloadTriggered && contentPDF && currentState && current_company && !downloadTriggeredRef.current) {
          downloadTriggeredRef.current = true;
          pdfDownload();
      }
    }, [downloadTriggered, contentPDF, currentState, current_company]);

    useEffect(()=>{
      if (!accessToken) return;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      let profID = cookie.get("profileid");
      
      const response = axiosInstance
        .get(`/api/profileuser/${profID}/`, { headers })
        .then((response) => {
          if (response && response.data) {
              setUserData(prev => ({
                ...prev,
                authorName: response?.data?.first_name,
                organization: response?.data?.org_associated,
                address: !!response?.data?.profile_address[0] ? response?.data?.profile_address[0]?.district : "",
              }))
            }
        })
        .catch((error) => {
          return error?.response?.data;
        });

    },[accessToken])

    useEffect(()=>{
      if (current_company) {
        switchPdfPage();
      }
      return ()=>{};
    }, [current_company])

    async function autoExpandOnce(){
        let textbox = [...document.querySelectorAll(".textBox-autoresizing")];
        let totalHeight = 0;
        textbox.map(subBox=>{
        return(
            subBox.style.height = 'auto',
            totalHeight = subBox.scrollHeight,
            totalHeight += 20,
            subBox.style.height = totalHeight <= parseInt(window.getComputedStyle(subBox).maxHeight) ? totalHeight + "px" : window.getComputedStyle(subBox).maxHeight
        );})
    }

    function switchPdfPage(){
      const current_company_config = getConfiguration();
      const { company_name, collab_logo } = current_company_config;
      setContentPDF((oldContent)=>({
        ...oldContent,
        companyLogo: '/images/shikshagrahaLogo.png'
      }))
    }

    function wordCounter(storyText) {
      storyText = JSON.parse(storyData?.formatted_content)?.filter((x) => x.type === "paragraph");
    
      if (storyText?.length > 0 && storyText[0]?.data?.text === storyData.title) {
        storyText = storyText.slice(1);
      }
      
      let content1 = [''];
      let content2 = '';
      let images = storyMediaIdArray ? storyMediaIdArray.map((y) => y?.file) : [];
      
      if (images.length % 2 === 0) {
        let wordFormed = '';
        let wordCount = 0;
        let j = 0; 
        
        storyText.forEach((subData) => {
          let text = subData.data.text;
          let lines = text.split('\n');
          
          lines.forEach((line) => {
            for (let k = 0; k < line.length;) {
              if (wordCount < 300) {
                wordFormed += line[k++];
                if (line[k] === ' ') wordCount++;
                if (line[k] === undefined) wordCount++;
              } else {
                content1[j] = wordFormed;
                wordFormed = '';
                wordCount = 0;
                j++;
              }
            }
            wordFormed += '<br />'; 
            wordCount++;
          });
        });
    
        if (wordCount !== 0) {
          content1[j] = wordFormed;
        }
      } else {
        let wordFormed = '';
        let wordCount = 0;
        let wordCount1 = 0;
        let isContent2FullyFilled = false;
        let j = 0; 
        
        storyText.forEach((subData) => {
          let text = subData.data.text;
          let lines = text.split('\n')
          
          lines.forEach((line) => {
            for (let k = 0; k < line.length;) {
              if (wordCount1 < 100 && !isContent2FullyFilled) {
                content2 += line[k++];
                if (line[k] === ' ') wordCount1++;
                if (line[k] === undefined) wordCount1++;
              } else if (wordCount < 300) {
                isContent2FullyFilled = true;
                wordFormed += line[k++];
                if (line[k] === ' ') wordCount++;
                if (line[k] === undefined) wordCount++;
                if (k === line.length) {
                  wordFormed += '<br />';
                  wordCount++;
                }
              } else {
                content1[j] = wordFormed;
                wordFormed = '';
                wordCount = 0;
                j++;
              }
            }
            if (wordCount1 < 100) {
              content2 += '<br />';
              wordCount1++;
            }
          });
        });
    
        if (wordCount !== 0) {
          content1[j] = wordFormed;
        }
      }
    
      
      setContentPDF((oldContent) => ({
        ...oldContent,
        content1: content1,
        content2: content2
      }));
    }
    
  
    function tweetCounter(storyText){
  
      const tweetWordLimit = 280;
      storyText = storyData?.tweet;
      let counter = 0;
      let subCounter = 0;
      let content1='';
  
      for(let j=0; j<storyText?.length; j++){
        if(storyText[j] === ' '){
              counter+=1;
        }
      }
      counter+=1
      if(counter > tweetWordLimit) counter = tweetWordLimit;
  
      for(let j=0; j<storyText?.length; j++){
        if(subCounter < counter){
          if(storyText[j] === ' '){
            subCounter+=1;
          }
          content1 += storyText[j];
        } else{
          break;
        }
      }
      
      setContentPDF((oldContent)=>({
        ...oldContent,
        tweetContent: content1
      }))
  
    }

    async function uploadFile(formData, fileData, fileName, mediaId, storyId) {
      const story_media = storyData?.story_media.filter(item => item?.media_type === 'application/pdf');
  
      return new Promise((resolve, reject) => {
          if (story_media.length === 0) {
              createStoryMedia({
                  setter: (data) => {
                      setError({});
                      getStoryAllMedia({
                          setter: (data) => setFiles(data?.results || []),
                          loader: setIsUploading,
                          data: {
                              story: storyData?.id,
                          },
                          token: accessToken,
                      });
                      resolve(); // Resolve the promise here
                  },
                  errorHandler: (error) => {
                      setError(error);
                      reject(error); // Reject the promise on error
                  },
                  loader: setIsLoading,
                  data: formData,
                  token: accessToken,
              });
          } else {
              updateStoryMedia({
                  setter: (data) => {
                      setError({});
                      resolve(); // Resolve the promise here
                  },
                  errorHandler: (error) => {
                      setError(error);
                      reject(error); // Reject the promise on error
                  },
                  loader: setIsLoading,
                  data: {
                      story: storyData?.id,
                      name: fileName,
                      file: fileData,
                      id: mediaId,
                      media_type: 'application/pdf',
                  },
                  token: accessToken,
              });
          }
      });
  }
  

    async function convertImagesToPDF(imageDataURLs) {
      return new Promise((resolve, reject) => {
        try {
          const pdf = new jsPDF();
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
    
          imageDataURLs.forEach((imageDataURL, index) => {
            if (index !== 0) {
              pdf.addPage();
            }
            pdf.addImage(imageDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
  
          });
    
          const blob = pdf.output('blob');
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      });
    }
    
    async function captureAndConvertToJPG() {
      await autoExpandOnce();
      return new Promise((resolve, reject) => {
          const container = document.getElementsByClassName('no-page-break');
  
          if (container.length === 0) {
              reject(new Error('No elements found with class "no-page-break"'));
              return;
          }
  
          const seenElements = new Set();
          const uniqueElements = [];
  
          for (let i = 0; i < container.length; i++) {
              const element = container[i];
              const uniqueKey = element.outerHTML;  // Use outerHTML to identify duplicates
  
              if (!seenElements.has(uniqueKey)) {
                  seenElements.add(uniqueKey);
                  uniqueElements.push(element);
              }
          }
  
  
          const captureAndConvertContainer = async (element) => {
              try {
                  const canvas = await html2canvas(element);
                  const imgData = canvas.toDataURL('image/png');
                  return imgData;
              } catch (error) {
                  throw error;
              }
          };
  
          const promises = uniqueElements.map((element) => captureAndConvertContainer(element));
  
          Promise.all(promises)
              .then((imageDataArray) => {
                  resolve(imageDataArray);
              })
              .catch((error) => {
                  reject(error);
              });
      });
  }
  
    
    

    async function pdfDownload(){
      setIsLoading(true);
      const input = pdfRef.current;
      input.style.display = 'static';
      input.style.position = 'relative';
      input.style.left = 0;
      input.style.top = 0;
      document.getElementById('mainDivStory').style.position = 'fixed';
      document.getElementById('mainDivStory').style.overflowY = 'scroll';
      var opt = {
        margin:       0,
        filename:     `${storyData?.title}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        enableLinks: true,
        html2canvas:  { scale: 1, scrollY: 1, allowTaint : false,
          useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', width: 210 , height: 297}
      };
      await new Promise(resolve => setTimeout(resolve, 5000));
      const pdfFilePromise = html2pdf().from(input).set(opt).outputPdf();
      pdfFilePromise?.save();
        
      pdfFilePromise.then(()=>{
        input.style.position = 'absolute';
        input.style.left= '-9999px';
        input.style.top= '-9999px';
        document.getElementById('mainDivStory').style.position = 'static';
        document.getElementById('mainDivStory').style.overflowY = 'auto';
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      })
      let imageURL = await captureAndConvertToJPG();
      const pdfBlob = await convertImagesToPDF(imageURL);
      const file = new File([pdfBlob], `${storyData?.title}.pdf`, { type: 'application/pdf' });  
      const formData = new FormData();
      const story_media = storyData?.story_media.filter(item=>item?.media_type==='application/pdf')
  
      formData.append("file" , file);
      formData.append("story", storyData?.id);
      formData.append("name", `${storyData?.title}.pdf`);
      formData.append("media_type", 'application/pdf');
      // const uploadFilePromise = await uploadFile(formData, file, `${storyData?.title}.pdf`, story_media[0]?.id, storyData?.id);

      console.log(pdfBlob)
      uploadFile(formData, file, `${storyData?.title}.pdf`, story_media[0]?.id, storyData?.id)
        .then(() => {
            setIsLoading(false);
            downloadTriggeredRef.current = false;
            handleDownloadStop();
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
        });
      
      // .finally(() => {
      //   // setIsLoading(false);
      //   // downloadTriggeredRef.current = false;
      //   // setTimeout(() => {
      //   //   handleDownloadStop();
      //   // }, 3000);
      // });
    }
  
    function addPages(){
      if(!storyMediaIdArray || !storyData || 
        !storyData?.formatted_content || (contentPDF?.content1 ==='' && contentPDF?.content2 ===''
          || !current_company || !currentState 
        ) ) return;
        
      let images = [];
      storyMediaIdArray? images = storyMediaIdArray.map((y) => y?.base64_str) : images = []
      if(images.length !== 0 && images.length % 2 === 0){
        return(
          <>
            {pages.map((page, pageIndex) => (
              <StorySecondPage key={pageIndex} images={page} fontSize='1.1rem' imgPerPage={imagesPerPage} title={storyData?.title} />
            ))}
            {((currentState==='Nagaland')&& <StoryFifthPage {...storyData} />)}
            {(contentPDF.content2 === '') && showThirdPage(false)}
            {((currentState!=='Nagaland')&& <StoryFifthPage {...storyData} />)}
          </>
    
        );
      }else if(images.length !== 0 && images.length %2 !== 0){
        return (
          <>
            {((currentState==='Nagaland')&& <StoryFifthPage {...storyData} />)}
            {(contentPDF.content1[0] === '') && pages.map((page, pageIndex) => (
              <StorySecondPage key={pageIndex} content1={contentPDF.content2} images={page} fontSize='1.1rem' tweet={contentPDF.tweetContent} imgPerPage={imagesPerPage} title={storyData?.title} />
            ))}
            
            {(contentPDF.content1[0] !== '') && pages.map((page, pageIndex) => (
              <StorySecondPage key={pageIndex} content1={contentPDF.content2} images={page} fontSize='1.1rem' imgPerPage={imagesPerPage} title={storyData?.title} />
            ))}
            {(contentPDF.content1[0] !== '')&& showThirdPage(false)}
            {((currentState!=='Nagaland')&& <StoryFifthPage {...storyData} />)}
          </>
        )
      } else if(images.length === 0){
        console.log('Here')
        return(
          <>
              {((currentState==='Nagaland')&& <StoryFifthPage {...storyData} />)}
              {(contentPDF.content2 === '') && showThirdPage(true)}
              {((currentState!=='Nagaland')&& <StoryFifthPage {...storyData} />)}
          </>
    
        );
      }
    }

    function showThirdPage(isHeadingVisible) {
      if(contentPDF.content1.length===0 || !storyData) return;
      console.log('here in show third')
      return (
        contentPDF.content1.map((item, index) => {
          if(item === '') return;
          if(isHeadingVisible===true && index!==0) isHeadingVisible=false; 
          if(index===contentPDF.content1.length-1){
            return (
              <StoryThirdPage key={`${item}_${index}`} content2={item} fontSize='1.1rem' tweet={contentPDF.tweetContent} shouldShowStoryHeading={isHeadingVisible} title={storyData?.title} />
            );
          }else{
            return (
              <StoryThirdPage key={`${item}_${index}`} content2={item} fontSize='1.1rem' shouldShowStoryHeading={isHeadingVisible} title={storyData?.title} />
            );
          }
        })
      );
    }

    useEffect(()=>{
      console.log('ContentPDF: ', contentPDF)
    }, [contentPDF])

    function showPdfAccToCompany(){
        if(!current_company || !currentState || !storyData || !userData || !contentPDF) return;

        let hasName = false;
        let hasOrg = false;
        let hasAddress = false;
    
        if (
            userData?.authorName !== null &&
            userData?.authorName !== "undefined" &&
            userData?.authorName !== ""
        ) {
          hasName = true;
        }
        if (
            userData?.organization !== null &&
            userData?.organization !== "undefined" &&
            userData?.organization !== ""
        ) {
          hasOrg = true;
        }
        if (
            userData?.address !== null &&
            userData?.address !== "undefined" &&
            userData?.address !== ""
        ) {
          hasAddress = true;
        }
    
        let authorDetail = "Author : ";
    
        if (hasName) {
            authorDetail += userData?.authorName;
          if (hasOrg) {
            authorDetail += ", " + userData?.organization;
          }
          if (hasAddress) {
            authorDetail += ", " + userData?.address;
          }
        } else if (hasOrg) {
            authorDetail += userData?.organization;
          if (hasAddress) {
            authorDetail += ", " + userData?.address;
          }
        } else if (hasAddress) {
            authorDetail += ", " + userData?.address;
        } else {
          authorDetail = "";
        }
    
        return (
          <>
            {storyData && userData && (
              <StoryFirstPage
                title={storyData?.title}
                author={authorDetail}
                companyLogo={contentPDF?.companyLogo}
                schoolName={userData?.organization}
                currentState={currentState}
              />
            )}

            {addPages()}
          </>
        );
    }


    return (
        <div className="container mx-auto" id="mainDivStory">
            <div ref={pdfRef} style={{
                // position: 'absolute',
                // left: '-9999px',
                // top: '-9999px',
            }}>
            {showPdfAccToCompany()}
            </div>
        </div>
    );
};

export default PdfDownloader;
