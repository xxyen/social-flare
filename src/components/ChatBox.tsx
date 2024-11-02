import { useState } from 'react'
import '../App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = '';
const systemMessage = { 
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}


export type MessageDirection = "incoming" | "outgoing" | 0 | 1 ;

interface MessageString {
    message?:string;
    sentTime?:string;
    sender?:string;
    direction: MessageDirection;
    position: "single" | "first" | "normal" | "last" | 0 |  1 | 2 | 3;
}


function ChatBox() {
  const [messages, setMessages] = useState<MessageString[]>([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming",
      position: "normal",
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message:string) => {
    const newMessage:MessageString = {
      message,
      direction: 'outgoing',
      sender: "user",
      position: "normal",
    };

    const newMessages = [...messages, newMessage];
    console.log("sending...");
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages:MessageString[]) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    const apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    console.log("Step1");

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-4o-mini",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
        console.log("Step2");
        return data.json();
    }).then((data) => {
        console.log("Step3");
        console.log(data);
        const newMessage:MessageString = {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            direction: "incoming",
            position: "normal",
        }
        const newMessages = [...chatMessages, newMessage];
        setMessages(newMessages);
        setIsTyping(false);
    }).catch((err)=>{
        console.log(err);
    });
  }

  return (
    <div className="ChatBox">
      <div style={{ position:"relative", height: "500px", width: "300px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={{
                    message: message.message,
                    sentTime: message.sentTime,
                    sender: message.sender,
                    direction: message.direction ? message.direction : "outgoing",
                    position: "normal"
                  }} />;
                })}
                                
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default ChatBox

