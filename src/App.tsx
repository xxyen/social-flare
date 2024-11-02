import { useState, useEffect } from 'react';
import getModifiedText from './utils/api';
import { ChatBubbleLeftIcon, HomeIcon } from '@heroicons/react/24/solid';
import ChatBox from './ChatBox';

function App() {
  const [inputText, setInputText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 

  useEffect(() => {
    chrome.storage.local.get("selectedText", (data) => {
      setInputText(data.selectedText || "");
    });
  }, []);

  const handleModifyText = async () => {
    setIsLoading(true);
    try {
      const prompt = "Create a viral social media post for :";
      const result = await getModifiedText(prompt, inputText);
      setModifiedText(result);
      navigator.clipboard.writeText(result);
    } catch (error) {
      console.error("Error modifying text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[500px] w-[300px] mx-auto">
      {activeTab === 'home' ? (
        <div className="text-left px-4"> 
          <h1 className="text-3xl font-bold">Social Flare</h1>
          <h2 className="text-xl mt-4">Selected Text</h2>
          <p className="text-gray-600 mt-2">{inputText}</p>
          <button
            onClick={handleModifyText}
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Loading...' : 'Modify Text'}
          </button>
          {modifiedText && (
            <div className="mt-6">
              <h2 className="text-xl">Modified Text:</h2>
              <p className="mt-2 text-gray-800">{modifiedText}</p>
              <button
                onClick={() => navigator.clipboard.writeText(modifiedText)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      ) : (
        <ChatBox />
      )}

      <div className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-300 flex justify-center space-x-8 py-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <HomeIcon className="h-6 w-6" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center ${activeTab === 'chat' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
}

export default App;
