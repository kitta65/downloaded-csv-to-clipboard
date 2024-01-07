import Message from "./message.ts";

async function sendMessage(message: Message) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length !== 1 || !tabs[0].id) {
    return;
  }
  // fails when recent download history is visible
  await chrome.tabs
    .sendMessage(tabs[0].id, message)
    .catch((err) => console.log(err));
}

chrome.downloads.onChanged.addListener(async (delta) => {
  // check status
  if (
    !delta.state ||
    delta.state.previous !== "in_progress" ||
    delta.state.current !== "complete"
  ) {
    return;
  }

  const items = await chrome.downloads.search({ id: delta.id });
  const item = items[0];

  // check file extension
  if (!item.filename.endsWith(".csv")) {
    const msg = `${item.filename} is not a csv`;
    console.log(msg);
    return;
  }

  // check file size
  if (
    item.totalBytes < 0 ||
    1 * 1024 ** 2 < item.totalBytes // 1MB
  ) {
    const msg = `${item.filename} is too large or unknown`;
    sendMessage(new Message(msg, 1));
    return;
  }

  const response = await fetch(`file:///${items[0].filename}`);
  const text = await response.text(); // TODO copy to clipboard
  console.log(text);
  sendMessage(new Message("copied to clipboard", 0));
});
