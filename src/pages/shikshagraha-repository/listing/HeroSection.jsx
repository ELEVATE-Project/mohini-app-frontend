import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { IoMicOutline } from "react-icons/io5";
import { FaRegStopCircle } from "react-icons/fa";
import { TbSend2 } from "react-icons/tb";
import { useRepositoryStore } from "../repository-hooks/useRepositoryStore";
import heroImg from "../../../assets/background-image.png";

export default function HeroSection() {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  const setGlobalSearch = useRepositoryStore(state => state.setSearch);
  const setSearchInput = useRepositoryStore(state => state.setSearchInput);

  const disableSendButton =
    search.trim().length === 0 || hasStartedRecording;

  const handleSendMessage = e => {
    e?.preventDefault();

    if (!search.trim()) return;

    if (search.length > 3) {
      setGlobalSearch(search);
    }
  };

  const handleOnInputText = value => {
    setSearch(value);
    setSearchInput(value);

    if (value.trim() === "") {
      setGlobalSearch("");
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    setMediaRecorder(recorder);
    setHasStartedRecording(true);

    recorder.onstop = () => {
      setHasStartedRecording(false);
    };

    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
  };

  return (
    <div
      className="w-full flex-1 relative rounded-xl overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${heroImg})`,
        minHeight: "700px",
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">

        <h1 className="text-lg md:text-3xl text-white mb-3 font-semibold">
          {t("heroTitle")}
        </h1>

        <p className="text-white text-sm md:text-lg mb-6">
          {t("heroDescription")}
        </p>



        <form
          onSubmit={handleSendMessage}
          className="flex items-center bg-[var(--listing-surface)] rounded-2xl px-4 py-3 w-full max-w-2xl shadow-sm"
        >
          {/* Search Icon */}
          <Search className="w-5 h-5 text-[var(--listing-subdued-text)]" />

          {/* Input */}
          <input
            value={search}
            onChange={e => handleOnInputText(e.target.value)}
            placeholder="Search with AI"
            className="flex-1 bg-transparent px-4 py-2 outline-none text-[var(--listing-muted-text)] placeholder-[var(--listing-subdued-text)]"
          />

          {/* MIC */}
          <button
            type="button"
            onClick={hasStartedRecording ? stopRecording : startRecording}
            className="mr-2"
          >
            {hasStartedRecording ? (
              <FaRegStopCircle className="w-5 h-5 text-[var(--listing-danger)]" />
            ) : (
              <IoMicOutline className="w-5 h-5 text-[var(--listing-icon-mid)]" />
            )}
          </button>

          {/* SEND */}
          <button
            type="submit"
            disabled={disableSendButton}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition
      ${disableSendButton
                ? "bg-[var(--listing-disabled)]"
                : "bg-[var(--listing-secondary)] hover:bg-[var(--listing-secondary-hover)]"
              }
    `}
          >
            <TbSend2 className="w-5 h-5 text-white" />
          </button>
        </form>

      </div>
    </div>
  );
}