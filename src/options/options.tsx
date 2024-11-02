import { useEffect, StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { saveSettings, loadSettings, resetSettings, Settings, Tone } from '../utils/storage';
import { 
  Container, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Snackbar 
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function Options() {
  const [settings, setSettings] = useState<Settings>({
    tone: 'polite',
    maxWords: 100,
    generateHashtags: false,
    includeEmoji: false,
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const handleSave = () => {
    saveSettings(settings).then(() => {
      console.log('Settings saved!');
      setShowAlert(true);
    });
  };

  const handleReset = () => {
    resetSettings().then(loadSettings).then(setSettings);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Options</Typography>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Tone</InputLabel>
        <Select
          value={settings.tone}
          onChange={(e) => setSettings({ ...settings, tone: e.target.value as Tone })}
          label="Tone"
        >
          <MenuItem value="polite">Polite</MenuItem>
          <MenuItem value="witty">Witty</MenuItem>
          <MenuItem value="enthusiastic">Enthusiastic</MenuItem>
          <MenuItem value="friendly">Friendly</MenuItem>
          <MenuItem value="informational">Informational</MenuItem>
          <MenuItem value="funny">Funny</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        type="number"
        label="Max Words"
        variant="outlined"
        sx={{ mt: 2 }}
        value={settings.maxWords}
        onChange={(e) => setSettings({ ...settings, maxWords: parseInt(e.target.value) })}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={settings.generateHashtags}
            onChange={(e) => setSettings({ ...settings, generateHashtags: e.target.checked })}
          />
        }
        label="Generate Hashtags"
        sx={{ mt: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={settings.includeEmoji}
            onChange={(e) => setSettings({ ...settings, includeEmoji: e.target.checked })}
          />
        }
        label="Include Emoji"
        sx={{ mt: 1 }}
      />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={handleReset}>
          Reset to Default
        </Button>
      </div>

      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setShowAlert(false)} severity="success">
          Settings saved successfully!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Options;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Options />
  </StrictMode>
);
