
export function getConfirmChanges(language) {
    let defaultText = 'Confirm Changes';

    switch(language) {
        case "hi":
            return 'परिवर्तन पुष्टि करें'
        case "kn":
            return 'ಬದಲಾವಣೆಗಳನ್ನು ದೃಢೀಕರಿಸಿ'
        default:
            return defaultText
    }   
}

export function getPopUpChanges(language) {
    let defaultText = `
        <div class='text-class'>
            You've been inactive for a while.
            Do you want to continue?
        </div>
    `;

    switch(language) {
        case "hi":
            return `
                <div class='text-class'>
                    आप कुछ समय से निष्क्रिय हैं।  
                    क्या आप जारी रखना चाहते हैं?
                </div>
            `
        case "kn":
            return `
                <div class='text-class'>
                    ನೀವು ಸ್ವಲ್ಪ ಸಮಯದಿಂದ ನಿಷ್ಕ್ರಿಯರಾಗಿದ್ದೀರಿ.
                    ನೀವು ಮುಂದುವರಿಸಲು ಬಯಸುತ್ತೀರಾ?
                </div>
            `
        default:
            return defaultText
    }
    
}

export function getComfirmButtonTranslation(language) {
    const defaultText = "Yes"

    switch(language) {
        case "hi":
            return "हाँ"
        case "kn":
            return 'ಹೌದು'
        default:
            return defaultText
    }
}

export function getDenyButtonTranslation(language) {
    const defaultText = "No"

    switch(language) {
        case "hi":
            return "नहीं"
        case "kn":
            return 'ಇಲ್ಲ'
        default:
            return defaultText
    }
}

export function getDoLaterTranslation(language) {
    const defaultText = "I will do it later"

    switch(language) {
        case "hi":
            return "मैं इसे बाद में करूंगा"
        case "kn":
            return 'ನಾನು ಅದನ್ನು ನಂತರ ಮಾಡುತ್ತೇನೆ.'
        default:
            return defaultText
    }
}

export function getEvidenceTranslation(language) {
    const defaultText = "Would you like to add evidences to the project?"

    switch(language) {
        case "hi":
            return "क्या आप परियोजना में साक्ष्य जोड़ना चाहेंगे?"
        case "kn":
            return 'ಯೋಜನೆಗೆ ಪುರಾವೆಗಳನ್ನು ಸೇರಿಸಲು ನೀವು ಬಯಸುವಿರಾ?'
        default:
            return defaultText
    }
}

export function getUploadTranslation(language) {
    const defaultText = "Add Photos"

    switch(language) {
        case "hi":
            return "फ़ोटो जोड़ें"
        case "kn":
            return 'ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ'
        default:
            return defaultText
    }
}

export function getStoryTextTranslation(language) {
    const defaultText = "Here is your improvement story"

    switch(language) {
        case "hi":
            return "ये है आपकी इम्प्रूवमेंट स्टोरी"
        case "kn":
            return 'ನಿಮ್ಮ ಸುಧಾರಣೆಯ ಕಥೆ ಇಲ್ಲಿದೆ'
        default:
            return defaultText
    }
}

export function getDownloadStoryTextTranslation(language) {
    const defaultText = "Download Story"

    switch(language) {
        case "hi":
            return "कहानी डाउनलोड करें"
        case "kn":
            return 'ಕಥೆಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
        default:
            return defaultText
    }
}

export function getEditStoryTextTranslation(language) {
    const defaultText = "Edit Story"

    switch(language) {
        case "hi":
            return "कहानी संपादित करें"
        case "kn":
            return 'ಕಥೆಯನ್ನು ಸಂಪಾದಿಸಿ'
        default:
            return defaultText
    }
}

export function getStoryLoaderTranslation(language) {
    const defaultText = "Creating your story, this may take a moment. Please wait..."

    switch(language) {
        case "hi":
            return "आपकी कहानी बनाने में कुछ समय लग सकता है। कृपया प्रतीक्षा करें..."
        case "kn":
            return 'ನಿಮ್ಮ ಕಥೆಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ, ಇದು ಸ್ವಲ್ಪ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳಬಹುದು. ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...'
        default:
            return defaultText
    }
}

export function getDownloadLoaderTranslation(language) {
    const defaultText = "Downloading please wait..."

    switch(language) {
        case "hi":
            return "डाउनलोड हो रहा है कृपया प्रतीक्षा करें..."
        case "kn":
            return 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...'
        default:
            return defaultText
    }
}

export function getHomepageHeadingTranslation(language) {
    const defaultText = "Micro Improvement Report"

    switch(language) {
        case "hi":
            return "सूक्ष्म सुधार रिपोर्ट"
        case "kn":
            return 'ಸೂಕ್ಷ್ಮ ಸುಧಾರಣಾ ವರದಿ'
        default:
            return defaultText
    }
}

export function getHomepageHeading1Translation(language) {
    const defaultText = "with Mitra!"

    switch(language) {
        case "hi":
            return "मित्रा के साथ!"
        case "kn":
            return 'ಮಿತ್ರ ಜೊತೆ!'
        default:
            return defaultText
    }
}

export function getHomepageListTranslation(language) {
    const defaultText = "Start chatting with Mitra below"

    switch(language) {
        case "hi":
            return "नीचे मित्रा के साथ चैटिंग शुरू करें"
        case "kn":
            return 'ಕೆಳಗೆ ಮಿತ್ರ ಜೊತೆ ಚಾಟ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ'
        default:
            return defaultText
    }
}

export function getHomepageList1Translation(language) {
    const defaultText = "Add photos to your report"

    switch(language) {
        case "hi":
            return "अपनी रिपोर्ट में फ़ोटो जोड़ें"
        case "kn":
            return 'ನಿಮ್ಮ ವರದಿಗೆ ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ'
        default:
            return defaultText
    }
}

export function getHomepageList2Translation(language) {
    const defaultText = "Download your report"

    switch(language) {
        case "hi":
            return "अपनी रिपोर्ट डाउनलोड करें"
        case "kn":
            return 'ನಿಮ್ಮ ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
        default:
            return defaultText
    }
}

export function getPlaceholder1Translation(language) {
    const defaultText = "Listening... Speak now"

    switch(language) {
        case "hi":
            return "सुन रही हूँ... अब बोलो"
        case "kn":
            return 'ಆಲಿಸುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ'
        default:
            return defaultText
    }
}

export function getPlaceholder2Translation(language) {
    const defaultText = "Processing speech... Please wait"

    switch(language) {
        case "hi":
            return "भाषण संसाधित हो रहा है... कृपया प्रतीक्षा करें"
        case "kn":
            return 'ಭಾಷಣವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ'
        default:
            return defaultText
    }
}

export function getPlaceholder3Translation(language) {
    const defaultText = "Type your message"

    switch(language) {
        case "hi":
            return "अपना संदेश लिखें"
        case "kn":
            return 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ'
        default:
            return defaultText
    }
}

export function getNewChatTranslation(language) {
    const defaultText = "New chat"

    switch(language) {
        case "hi":
            return "नई चैट"
        case "kn":
            return 'ಹೊಸ ಚಾಟ್'
        default:
            return defaultText
    }
}

export function getAllMicroImprovementTranslation(language) {
    const defaultText = "All Micro Improvements"

    switch(language) {
        case "hi":
            return "सभी सूक्ष्म सुधार"
        case "kn":
            return 'ಎಲ್ಲಾ ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು'
        default:
            return defaultText
    }
}
