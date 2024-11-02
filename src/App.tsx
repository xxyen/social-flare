import { useState, useEffect } from 'react';
import { Box, Typography, Container, AppBar, Tabs, Tab, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import getModifiedText from './utils/api';
import ChatBox from './components/ChatBox';
import Options from './options/options';

function App() {
  const [inputText, setInputText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

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
      <Box flexGrow={1} p={1} sx={{ overflowY: 'auto', paddingBottom: '56px' }}>
        {activeTab === 0 && (
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>Social Flare</Typography>
            <Typography variant="h6" mt={2}>Selected Text</Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>{inputText}</Typography>
            <Button variant="contained" color="primary" onClick={handleModifyText} disabled={isLoading} sx={{ mt: 2 }}>
              {isLoading ? <CircularProgress size={24} /> : 'Modify Text'}
            </Button>
            {modifiedText && (
              <Box mt={3}>
                <Typography variant="h6">Modified Text:</Typography>
                <Typography variant="body1">{modifiedText}</Typography>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={handleCopyToClipboard}
                  sx={{ mt: 2 }}
                >
                  Copy to Clipboard
                </Button>
              </Box>
            )}
          </Box>
        )}
        {activeTab === 1 && <ChatBox />}
        {activeTab === 2 && <Options />}
      </Box>

      <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary">
          <Tab icon={<HomeIcon />} label="Home" />
          <Tab icon={<ChatIcon />} label="Chat" />
          <Tab icon={<SettingsIcon />} label="Options" />
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
