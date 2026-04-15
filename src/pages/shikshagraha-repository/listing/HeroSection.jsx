import React from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { IoMicOutline } from "react-icons/io5";
import { FaRegStopCircle } from "react-icons/fa";
import { TbSend2 } from "react-icons/tb";
import { useRepositoryStore } from "../repository-hooks/useRepositoryStore";
import heroImg from "../../../assets/background-image.png";

export default function HeroSection() {
  const { t } = useTranslation();

  const search = useRepositoryStore((state) => state.searchInput);
  const setGlobalSearch = useRepositoryStore((state) => state.setSearch);
  const setSearchInput = useRepositoryStore((state) => state.setSearchInput);
  const [mediaRecorder, setMediaRecorder] = React.useState(null);
  const [hasStartedRecording, setHasStartedRecording] = React.useState(false);

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
      className="relative w-full left-1/2 -translate-x-1/2 overflow-hidden mt-4 min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[65vh] xl:min-h-[70vh]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <h1 className="text-lg md:text-3xl text-white font-semibold">
          {t("heroTitle")}
        </h1>

        <p className="text-white text-sm md:text-lg">
          {t("heroDescription")}
        </p>

        <form
          onSubmit={handleSendMessage}
          className="flex flex-row flex-nowrap items-center gap-2 bg-[var(--listing-surface)] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 w-full max-w-2xl shadow-sm"
        >
          {/* Search Icon */}
          <Search className="w-5 h-5 text-[var(--listing-subdued-text)] flex-shrink-0" />

          {/* Input */}
          <input
            value={search}
            onChange={e => handleOnInputText(e.target.value)}
            placeholder="Search with AI"
            className="flex-1 min-w-0 bg-transparent px-3 py-2 sm:px-4 sm:py-2 outline-none text-[var(--listing-muted-text)] placeholder-[var(--listing-subdued-text)]"
          />

          {/* MIC */}
          <button
            type="button"
            onClick={hasStartedRecording ? stopRecording : startRecording}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--listing-surface)] hover:bg-[var(--listing-surface-hover)] transition flex-shrink-0"
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
            className={`flex items-center justify-center h-10 w-10 rounded-xl transition flex-shrink-0 ${
              disableSendButton
                ? "bg-[var(--listing-disabled)]"
                : "bg-[var(--listing-secondary)] hover:bg-[var(--listing-secondary-hover)]"
            }`}
          >
            <TbSend2 className="w-5 h-5 text-white" />
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}