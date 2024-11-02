import { useState, useEffect } from 'react'
import { Snackbar, Alert } from '@mui/material';
import '../App.css'
import { MessageString } from '../utils/storage';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator,  MessageSeparator,Avatar  } from '@chatscope/chat-ui-kit-react';
import ReactMarkdown from "react-markdown";
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';


const API_KEY = '';

export type MessageDirection = "incoming" | "outgoing" | 0 | 1;


function ChatBox({initial,messages,setInitial,setMessages}:
  {initial:boolean,messages:MessageString[],
    setInitial:(initail:boolean)=>void,setMessages:(messages:MessageString[])=>void}) {
  const todayString = new Date().toDateString();

  
  const [isTyping, setIsTyping] = useState(false);
  const [socialFlarePrompt, setSocialFlarePrompt] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [ value, setValue ] = useState(""); 




  useEffect(() => {
    fetch('/prompt.txt')  
      .then((response) => response.text())
      .then((text) => {
        setSocialFlarePrompt(text);
      })
      .catch((error) => console.error("Failed to load prompt:", error));
  }, []);

  const handleSend = async () => {
    const newMessage: MessageString = {
      message: value,
      direction: 'outgoing',
      sender: "user",
      position: "normal",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    setValue(""); 
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: MessageString[]) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-4o-mini",
      "messages": [
        { "role": "system", "content": socialFlarePrompt },  
        ...apiMessages
      ]
    };

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => data.json())
      .then((data) => {
        const newMessage: MessageString = {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming",
          position: "normal",
        };
        const newMessages = [...chatMessages, newMessage];
        setMessages(newMessages);
        setIsTyping(false);
      }).catch((err) => {
        console.log(err);
      });
  }

  const clickInitial = () => {
    setInitial(false);
  }

  const handleCopyToClipboard = async (text:string|undefined) => {
    try {
      if(text){
        await navigator.clipboard.writeText(text);  
      }
      setShowAlert(true);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="ChatBox" style={{ position:"relative", height: "475px"}}>
      {!initial && (           
        <MainContainer>
          <Snackbar
            open={showAlert}
            autoHideDuration={2000}
            onClose={() => setShowAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setShowAlert(false)} severity="success" sx={{ width: '100%' }}>
              Text copied to clipboard!
            </Alert>
          </Snackbar>  
          <ChatContainer>
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="SocialFlare is typing" /> : null}
            >
              <MessageSeparator content={todayString} style={{fontSize:'10px'}} />
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} style={{ fontSize: '12px' }}
                model={{
                    type: "custom",
                    sentTime: message.sentTime,
                    sender: message.sender,
                    direction: message.direction ? message.direction : "outgoing",
                    position: "normal",
                }}
            >
                {message.direction === "incoming" ? <Avatar size='md' src={'icon.jpg'} /> 
                : null}
                
                <Message.CustomContent>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                    {message.direction === "incoming" && (
                    <FontAwesomeIcon onClick={()=>handleCopyToClipboard(message.message)} icon={faCopy} />
                  )}
                </Message.CustomContent>
                </Message>;
            
                })}             
            </MessageList>
            <MessageInput style={{fontSize: '12px'}} placeholder="Type message here" onSend={handleSend} attachButton={false} onChange={(val) => setValue(val)} value={value} onPaste={(evt) => {
                evt.preventDefault();
                setValue(evt.clipboardData.getData("text"));
         }} />              
          </ChatContainer>
        </MainContainer>)}

      {initial && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          cursor: 'pointer',
          textAlign: 'center',
          width: '100%', 
          height:'80vh', 
        }}>
          <img style={{width:'50px', height:'50px'}} src={'icon2.jpg'}></img>
          <p style={{fontSize:'16px'}}>SocialFlare—making your posts pop and sparkle in seconds! ✨📲</p>
          <button onClick={clickInitial} style={{fontSize: '16px', backgroundColor:'#d6e6ff'}}>Click to start</button>
        </div>
      )}
    </div>
  )
}

export default ChatBox;
