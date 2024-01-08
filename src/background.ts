import { getTsv, getItemStatus } from "./utils";

async function sendMessage(text: string) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length !== 1 || !tabs[0].id) {
    return;
  }
  await chrome.tabs
    .sendMessage(tabs[0].id, text)
    .catch((err) => console.log(err));
}

chrome.downloads.onChanged.addListener(async (delta) => {
  // check download status
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
  if (!item.filename.endsWith(".csv")) return;

  // check file status
  if (getItemStatus(item) !== "ready") return;

  const tsv = await getTsv(item.filename);
  sendMessage(tsv);
});
