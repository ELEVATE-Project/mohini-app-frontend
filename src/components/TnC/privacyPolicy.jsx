import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";

import "./privacyPolicyStyle.css";
import { useTranslation } from "react-i18next";


const PrivacyPolicyPage = ({ tncText, onAccept, onDecline }) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  const { t } = useTranslation();

  return (
    <>
        <div className="tnc-cover"></div>
        <div className="tnc-bg">
            <div className="tnc-container">
            <div className="tnc-content">
                <div className="tnc-text">
                    <MarkdownComponent markdownText={tncText} />
                </div>
            </div>
            <div className="tnc-buttons">
                <button className="tnc-button accept" onClick={onAccept}>
                  {t('tncConfirm')}
                </button>
                <button className="tnc-button decline" onClick={onDecline}>
                  {t('tncDecline')}
                </button>
            </div>
            </div>
        </div>
    </>
  );
};

PrivacyPolicyPage.propTypes = {
  tncText: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default PrivacyPolicyPage;

const MarkdownComponent = ({ markdownText }) => {
    return (
      <ReactMarkdown
        children={markdownText}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Enable raw HTML parsing
      />
    );
  };