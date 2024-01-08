import { useState } from "react";
import { csv2tsv, sleep } from "./utils";

type Props = {
  item: chrome.downloads.DownloadItem;
};

type Status = "ready" | "processing" | "done" | "large" | "unknown" | "removed";

function basename(path: string): string {
  // https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
  return path.split("\\").pop()!.split("/").pop()!;
}

export default function Item(props: Props) {
  const [status, setStatus] = useState<Status>(() => {
    const item = props.item;
    if (!item.exists) {
      return "removed";
    } else if (item.totalBytes < 0) {
      return "unknown";
    } else if (1 * 1024 ** 2 < item.totalBytes) {
      // 1MB
      return "large";
    } else {
      return "ready";
    }
  });

  async function handleClick() {
    if (status !== "ready") return; // NOP
    setStatus("processing");

    const item = props.item;
    const response = await fetch(`file:///${item.filename}`);
    const csv = await response.text();
    const tsv = csv2tsv(csv);
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
