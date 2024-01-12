import { useState, useEffect } from "react";
import Item from "./Item.tsx";

export default function App() {
  const [items, setItems] = useState<chrome.downloads.DownloadItem[]>([]);
  useEffect(
    () => {
      chrome.downloads
        .search({
          limit: 10,
          orderBy: ["-startTime"],
        })
        .then((items) => setItems(items));
    },
    // only run after initial render
    // https://react.dev/reference/react/useEffect#specifying-reactive-dependencies
    [],
  );

  return (
    <>
      <h1>Downloaded CSV to Clipboard</h1>
      {items
        .filter((item) => item.filename.endsWith(".csv"))
        .map((item) => (
          <div key={item.id}>
            <Item item={item} />
          </div>
        ))}
    </>
  );
}
