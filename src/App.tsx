import { useState, useEffect } from "react";
import getModifiedText from "./utils/api";

function App() {
  const [inputText, setInputText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div style={{ position:"relative", height: "500px", width: "300px"  }}>
      <h1>Social Flare</h1>
      <h2>Selected Text</h2>
      <p>{inputText}</p>
      <button onClick={handleModifyText} disabled={isLoading}>
        {isLoading ? "Loading..." : "Modify Text"}
      </button>
      {modifiedText && (
        <div>
          <h2>Modified Text:</h2>
          <p>{modifiedText}</p>
          <button onClick={() => navigator.clipboard.writeText(modifiedText)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
