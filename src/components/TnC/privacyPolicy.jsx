import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";

import "./privacyPolicyStyle.css";


const PrivacyPolicyPage = ({ tncText, onAccept, onDecline }) => {
    console.log("tncText: ", tncText)
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
                Accept
                </button>
                <button className="tnc-button decline" onClick={onDecline}>
                Decline
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