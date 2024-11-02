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
  const predefinedTones: Tone[] = [
    'polite', 
    'professional', 
    'excited', 
    'friendly', 
    'informative', 
    'funny', 
    'inspiring'
  ];
  
  const [settings, setSettings] = useState<Settings>({
    tone: 'polite',
    maxWords: 100,
    generateHashtags: false,
    includeEmoji: false,
  });
  const [customTone, setCustomTone] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadSettings().then((loadedSettings) => {
      if (!predefinedTones.includes(loadedSettings.tone as Tone)) {
        setSettings({ ...loadedSettings, tone: 'other' });
        setCustomTone(loadedSettings.tone);
      } else {
        setSettings(loadedSettings);
      }
    });
  }, []);

  const handleSave = () => {
    if (settings.maxWords < 10 || settings.maxWords > 500) {
      setShowError(true);
      return;
    }
    const finalSettings = { ...settings, tone: settings.tone === 'other' ? customTone : settings.tone };
    saveSettings(finalSettings).then(() => {
      console.log('Settings saved!');
      setShowAlert(true);
    });
  };

  const handleReset = () => {
    resetSettings().then(loadSettings).then((defaultSettings) => {
      setSettings(defaultSettings);
      setCustomTone('');
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2}}>
      <Typography variant="h5" gutterBottom>Options</Typography>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Tone</InputLabel>
        <Select
          value={settings.tone}
          onChange={(e) => setSettings({ ...settings, tone: e.target.value as Tone })}
          label="Tone"
        >
          {predefinedTones.map((tone) => (
            <MenuItem key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</MenuItem>
          ))}
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      {settings.tone === 'other' && (
        <TextField
          fullWidth
          label="Custom Tone"
          variant="outlined"
          sx={{ mt: 2 }}
          value={customTone}
          onChange={(e) => setCustomTone(e.target.value)}
        />
      )}

      <TextField
        fullWidth
        type="number"
        label="Max Words"
        variant="outlined"
        sx={{ mt: 2 }}
        value={settings.maxWords}
        onChange={(e) => setSettings({ ...settings, maxWords: parseInt(e.target.value) })}
        helperText="Please enter a value between 10 and 500."
        error={settings.maxWords < 10 || settings.maxWords > 500}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setShowAlert(false)} severity="success">
          Settings saved successfully!
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setShowError(false)} severity="error">
          Max Words must be between 10 and 500.
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
