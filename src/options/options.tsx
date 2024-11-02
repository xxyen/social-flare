
import { useEffect, StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { saveSettings, loadSettings, resetSettings, Settings, Tone } from '../utils/storage';

function Options() {
  const [settings, setSettings] = useState<Settings>({
    tone: 'polite',
    maxWords: 100,
    generateHashtags: false,
    includeEmoji: false,
  });

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const handleSave = () => {
    saveSettings(settings).then(() => {
      alert('Settings saved!');
    });
  };

  const handleReset = () => {
    resetSettings().then(loadSettings).then(setSettings);
  };

  return (
    <div>
      <h1>Options</h1>
      <label>
        Tone:
        <select
          value={settings.tone}
          onChange={(e) => setSettings({ ...settings, tone: e.target.value as Tone })}
        >
          <option value="polite">Polite</option>
          <option value="witty">Witty</option>
          <option value="enthusiastic">Enthusiastic</option>
          <option value="friendly">Friendly</option>
          <option value="informational">Informational</option>
          <option value="funny">Funny</option>
        </select>
      </label>

      <label>
        Max Words:
        <input
          type="number"
          value={settings.maxWords}
          onChange={(e) => setSettings({ ...settings, maxWords: parseInt(e.target.value) })}
        />
      </label>

      <label>
        Generate Hashtags:
        <input
          type="checkbox"
          checked={settings.generateHashtags}
          onChange={(e) => setSettings({ ...settings, generateHashtags: e.target.checked })}
        />
      </label>

      <label>
        Include Emoji:
        <input
          type="checkbox"
          checked={settings.includeEmoji}
          onChange={(e) => setSettings({ ...settings, includeEmoji: e.target.checked })}
        />
      </label>

      <button onClick={handleSave}>Save</button>
      <button onClick={handleReset}>Reset to Default</button>
    </div>
  );
}

export default Options;


createRoot(document.getElementById('root')!).render(
<StrictMode>
    <Options />
</StrictMode>
)
