// Declare type for the window object to include difyChatbotConfig
declare global {
  interface Window {
    difyChatbotConfig: {
      token: string;
    };
  }
}

import { useEffect } from 'react';

// DifyChat component that loads the Dify chatbot configuration and script
const DifyChat = () => {
  useEffect(() => {
    // Get token from environment variable
    const token = import.meta.env.VITE_DIFY_CHATBOT_TOKEN;

    if (!token) {
      console.error('Dify chatbot token not found in environment variables');
      return;
    }

    // Configure Dify chatbot
    window.difyChatbotConfig = {
      token
    };

    // Create and load the script
    const script = document.createElement('script');
    script.src = 'https://udify.app/embed.min.js';
    script.id = token; // Using the token as the script ID
    script.defer = true;
    document.body.appendChild(script);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #dify-chatbot-bubble-button {
        background-color: #1C64F2 !important;
      }
      #dify-chatbot-bubble-window {
        width: 24rem !important;
        height: 40rem !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      // Only remove elements if they exist
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render anything visible
};

export default DifyChat; 