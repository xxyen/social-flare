import { useState } from 'react'
import '../App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, MessageSeparator,Avatar } from '@chatscope/chat-ui-kit-react';

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
  const todayString = new Date().toDateString();

  const [initial, setInitial] = useState(true);
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

  const clickInitial = () => {
    setInitial(false);
  }

  const handleSend = async (message:string) => {
    const newMessage:MessageString = {
      message,
      direction: 'outgoing',
      sender: "user",
      position: "normal",
    };

    const newMessages = [...messages, newMessage];
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
        return data.json();
    }).then((data) => {
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
    <div className="ChatBox" style={{ position:"relative", height: "440px"}}>
      {!initial && (        
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              <MessageSeparator content={todayString} style={{fontSize:'10px'}} />
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} style={{fontSize: '12px'}}
                    model={{
                    message: message.message,
                    sentTime: message.sentTime,
                    sender: message.sender,
                    direction: message.direction ? message.direction : "outgoing",
                    position: "normal",
                  }} children={message.direction === "incoming" ? <Avatar size='md' src={'icon.jpg'}  /> : null} />;
                })}             
            </MessageList>
            <MessageInput style={{fontSize: '12px'}} placeholder="Type message here" onSend={handleSend} attachButton={false}/>        
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

export default ChatBox

