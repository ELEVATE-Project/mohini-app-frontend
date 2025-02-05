import { useEffect, useState } from "react";
import { BiLoader, BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { handleFileUpload, partialUpdateMedia } from "../voice-chat";
import { useTranslation } from "react-i18next";

const UploadImages = ({storyData, access_token, projectId, files, setFiles}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading,] = useState(false);
  const [fileInput,] = useState([]);
  const [fileErrorText, setFileErrorText] = useState('');
  const [error, setError] = useState({
    response: "",
    status: 200,
  });

  const navigate = useNavigate();

  const { t } = useTranslation();
  

  const fileExceedText = t('fileExceedText');
  const fileSizeText = t('fileSizeText');

  return (
    <>
      <div className="container mx-auto px-0">
        <>
          <div className=" p-4">
            <div className="text-sm mb-4 font-bold text-gray-500">
              {t('uploadImagesStory')}
            </div>
            {(fileErrorText && fileErrorText !== '')&&<span className="text-red-500 block px-2">{fileErrorText}</span>}
            <div className="flex bg-zinc-50  mx-auto items-center justify-between w-100">
              <label className="block rounded-xl">
              <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-cyan-50 text-cyan-700 hover:bg-cyan-100">
                <span>{t('chooseFile')}</span>
              </div>
                <input
                  type="file"
                  className="block w-full text-md text-zinc-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-50 file:text-cyan-700
                    hover:file:bg-cyan-100 hidden
                  "
                  onChange={(e)=>{
                    handleFileUpload(
                      e, storyData, files, setFileErrorText, fileSizeText, access_token, 
                      setFiles, setError, projectId, setIsLoading, navigate
                    ).then(() => {
                      window.location.reload();
                    }).catch(err => {
                      console.error("File upload failed:", err);
                    });
                  }} 
                  accept="image/*"
                  multiple={false}
                  value={fileInput}
                  disabled={isLoading || (fileErrorText !== '' && fileErrorText !== fileSizeText && fileErrorText === fileExceedText)}
                  id='upload-fiel-ID'
                />
              </label>
              {error.status === 400 && (
                <div className="text-red-500 block px-4">
                  {t('UploadErrorMsg')}
                </div>
              )}
              {isUploading && (
                <div className="gray-red-500 block px-4">
                  {t('uploadLoadMsg')}
                </div>
              )}
            </div>
            <div
              className="h-screen overflow-auto"
              style={{ height: "432px" }}
            >
              {(isLoading) &&
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm z-1000">
                  <BiLoader className="animate-spin text-4xl text-system-green" />
                </div>
              }
              <div className="flex flex-wrap gap-4 mx-auto">
                {files?.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="my-3 rounded-md   relative inline-block"
                    >
                      <img
                        width="auto"
                        height="300px"
                        style={{ maxHeight: "300px", minHeight: "300px" }}
                        src={value?.public_url}
                        alt={value?.name}
                        className="object-cover"
                      />

                      <button
                        className="cursor-pointer	 absolute top-0 h-full w-full items-center justify-center hover:text-red-400 hover:bg-zinc-100 text-transparent flex z-10 "
                        onClick={() => partialUpdateMedia(value?.id, false, access_token, setIsLoading)}

                        disabled={isLoading}
                      >
                        <BiTrash className="mx-1" /> {t('removeImage')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      </div>
      {isLoading&& 
        <div className="login-load-spinner">
          <div className="login-div67">
            <BiLoader className="login-rotate-loader login-loader-icon" />
          </div>
        </div> 
      }
    </>
  );
};

export default UploadImages;
