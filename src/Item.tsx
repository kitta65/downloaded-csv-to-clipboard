import { useState } from "react";
import { sleep, getTsv, getItemStatus, ItemStatus } from "./utils";

type Props = {
  item: chrome.downloads.DownloadItem;
};

function basename(path: string): string {
  // https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
  return path.split("\\").pop()!.split("/").pop()!;
}

export default function Item(props: Props) {
  const [status, setStatus] = useState<ItemStatus>(() =>
    getItemStatus(props.item),
  );

  async function handleClick() {
    if (status !== "ready") return; // NOP
    setStatus("processing");

    const item = props.item;
    const tsv = await getTsv(item.filename);
    await window.navigator.clipboard.writeText(tsv);
    setStatus("done");
    await sleep(1000); // to avoid clicking repeatedly
    setStatus("ready");
  }

  function render() {
    const color = status === "ready" ? "" : "#999999";

    let text;
    switch (status) {
      case "processing":
        text = "processing ...";
        break;
      case "done":
        text = "copied!";
        break;
      default:
        text = basename(props.item.filename);
    }

    return (
      <div
        onClick={handleClick}
        style={{ color: color }}
        className="downloaded-item"
      >
        {text}
      </div>
    );
  }

  return <>{render()}</>;
}
