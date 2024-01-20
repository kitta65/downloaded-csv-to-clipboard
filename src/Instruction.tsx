export default function Instruction() {
  function handleClick() {
    chrome.tabs.create({
      url: `chrome://extensions/?id=${chrome.runtime.id}`,
    });
  }

  return (
    <div>
      <p>Allow access to file URLs!</p>
      <button onClick={handleClick}>Open Config</button>
    </div>
  );
}
