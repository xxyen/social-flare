chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "modifyText",
      title: "Modify with Social Flare",
      contexts: ["selection"],
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "modifyText" && info.selectionText) {
      chrome.storage.local.set({ selectedText: info.selectionText }, () => {
        chrome.action.openPopup(); 
      });
    }
  });
  