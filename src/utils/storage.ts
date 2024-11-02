export type Tone = 'polite' | 'witty' | 'enthusiastic' | 'friendly' | 'informational' | 'funny';

export interface Settings {
  tone: Tone;
  maxWords: number;
  generateHashtags: boolean;
  includeEmoji: boolean;
}

const defaultSettings: Settings = {
  tone: 'polite',
  maxWords: 100,
  generateHashtags: false,
  includeEmoji: false,
};

export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ settings }, () => {
      resolve();
    });
  });
}

export async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['settings'], (result) => {
      resolve(result.settings || defaultSettings);
    });
  });
}

export async function resetSettings(): Promise<void> {
  return saveSettings(defaultSettings);
}
