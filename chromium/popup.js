document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isXTab =
    tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com"));

  const toggles = ["global", "zen", "media"];

  chrome.storage.local.get(["ct-global", "ct-zen", "ct-media"], (result) => {
    document.getElementById("toggle-global").checked =
      result["ct-global"] !== false;
    document.getElementById("toggle-zen").checked = result["ct-zen"] === true;
    document.getElementById("toggle-media").checked =
      result["ct-media"] === true;
  });

  toggles.forEach((id) => {
    const toggleElement = document.getElementById(`toggle-${id}`);
    if (toggleElement) {
      toggleElement.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        const storageKey = `ct-${id}`;

        chrome.storage.local.set({ [storageKey]: isChecked });

        if (!isXTab) return;

        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            func: (key, val) => {
              try {
                const stringValue = val ? "true" : "false";
                window.localStorage.setItem(key, stringValue);

                if (key !== "ct-global") {
                  if (val) {
                    document.documentElement.classList.add(key);
                  } else {
                    document.documentElement.classList.remove(key);
                  }
                }
              } catch (err) {
                console.error("Minimal X: localStorage write failed", err);
              }
            },
            args: [storageKey, isChecked],
          })
          .then(() => {
            if (id === "global") chrome.tabs.reload(tab.id);
          })
          .catch((err) => {
            console.error("Minimal X: Script injection failed", err);
            if (id === "global") chrome.tabs.reload(tab.id);
          });
      });
    }
  });
});
