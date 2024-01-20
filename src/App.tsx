import { useState, useEffect } from "react";
import Item from "./Item.tsx";
import Instruction from "./Instruction.tsx";

export default function App() {
  const [items, setItems] = useState<chrome.downloads.DownloadItem[]>([]);
  const [allowed, setAllowed] = useState<boolean>(true);

  useEffect(
    () => {
      chrome.extension
        .isAllowedFileSchemeAccess()
        .then((bool) => setAllowed(bool));
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

  function render() {
    if (!allowed) {
      return <Instruction />;
    }

    return items
      .filter((item) => item.filename.endsWith(".csv"))
      .map((item) => (
        <div key={item.id}>
          <Item item={item} />
        </div>
      ));
  }

  return (
    <>
      <h1>Downloaded CSV to Clipboard</h1>
      {render()}
    </>
  );
}
