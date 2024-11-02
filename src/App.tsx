import { useState, useEffect } from 'react';
import { Box, Typography, Container, AppBar, Tabs, Tab, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import getModifiedText from './utils/api';
import ChatBox from './components/ChatBox';
import Options from './options/options';
import { MessageString, loadSettings, Settings } from './utils/storage';


function App() {
  const [inputText, setInputText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  const [initial, setInitial] = useState(true);
  const [messages, setMessages] = useState<MessageString[]>([
    {
      message: "Hey there! 😊 Ready to create some engaging social media content? Just let me know:\n1.**Topic of the post** (e.g., product launch, event update)\n2.**Audience** (e.g., followers, potential customers)\n3.**Preferred tone** (e.g., friendly, professional, humorous)\n If you're unsure, I can provide examples to help inspire you. Let’s get started! 🎉",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming",
      position: "normal",
    }
  ]);


  // useEffect(() => {
  //   chrome.storage.local.get("selectedText", (data) => {
  //     setInputText(data.selectedText || "");
  //   });

  //   loadSettings().then((loadedSettings) => {
  //     setSettings(loadedSettings);
  //   });
  // }, []);

  useEffect(() => {
    chrome.storage.local.get("selectedText", (data) => {
          setInputText(data.selectedText || "");
        });

    loadSettings().then(setSettings);

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.settings) {
        loadSettings().then(setSettings);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleModifyText = async () => {
    setIsLoading(true);
    try {
      const maxWords = settings?.maxWords || 100;
  
      const prompt = `Create a ${settings?.tone || 'polite'} social media post with a maximum of ${maxWords - 3} words ${
        settings?.generateHashtags ? 'and include hashtags' : 'without hashtags'
      } ${settings?.includeEmoji ? 'and include emojis' : 'without emojis'}. 
      Please notice: the new text must be related to the input text.`;

      console.log("Prompt:", prompt);
  
      const result = await getModifiedText(prompt, inputText, maxWords);
      setModifiedText(result);
      await navigator.clipboard.writeText(result);
      setShowAlert(true);
    } catch (error) {
      console.error("Error modifying text:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(modifiedText);
      setShowAlert(true);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container
      maxWidth="md"
      // sx={{
      //   display: 'flex',
      //   flexDirection: 'column',
      //   height: '100vh',
      //   justifyContent: 'space-between',
      //   overflow: 'hidden',
      //   px: 0,
      // }}
    >
      <Box flexGrow={1}>
        {activeTab === 0 && (
          <Box textAlign="left" p={1} sx={{ overflowY: 'auto', paddingBottom: '56px' }}>
            <Typography color='#3f51b5' style={{display:'flex', justifyContent:'center', alignContent:'center', fontWeight: 'bold'}} variant='h6' gutterBottom>Social Flare</Typography>
            <Typography variant='body1' >Selected Text</Typography>
            <Typography variant='body2' color="text.secondary">{inputText}</Typography>
            <Button variant="contained" color="primary" onClick={handleModifyText} disabled={isLoading} sx={{ mt: 2 , fontSize: 13}}>
              {isLoading ? <CircularProgress size={24} /> : 'Modify Text'}
            </Button>
            {modifiedText && (
              <Box mt={3}>
                <Typography variant='body1'>Modified Text:</Typography>
                <Typography variant='body2'>{modifiedText}</Typography>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={handleCopyToClipboard}
                  sx={{ mt: 2, fontSize: 13 }}
                >
                  Copy to Clipboard
                </Button>
              </Box>
            )}
          </Box>
        )}
        {activeTab === 1 && <ChatBox initial={initial} messages={messages} setInitial={setInitial} setMessages={setMessages}/>}
        {activeTab === 2 && <Options />}
      </Box>

      {/* <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0, height: 64 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary">
          <Tab icon={<HomeIcon />} iconPosition="start" sx={{alignItems: 'center',justifyContent: 'center', fontSize: '12px'}} label="Home" />
          <Tab icon={<ChatIcon />} iconPosition="start" sx={{alignItems: 'center',justifyContent: 'center', fontSize: '12px'}} label="Chat" />
          <Tab icon={<SettingsIcon />} iconPosition="start" sx={{alignItems: 'center',justifyContent: 'center', fontSize: '12px'}} label="Options" />
        </Tabs>
      </AppBar> */}
      <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0, height: 40, paddingTop: 0.3}}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary">
          <Tab 
            icon={<HomeIcon sx={{ fontSize: 20 }} />} 
            label="Home" 
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 0, 
              fontSize: '12px' // Adjust font size
            }} 
          />
          <Tab 
            icon={<ChatIcon sx={{ fontSize: 20 }} />} 
            label="Chat" 
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 0,
              fontSize: '12px'
            }} 
          />
          <Tab 
            icon={<SettingsIcon sx={{ fontSize: 20 }} />} 
            label="Options" 
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 0,
              fontSize: '12px'
            }} 
          />
        </Tabs>
      </AppBar>

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
    </Container>
  );
}

export default App;