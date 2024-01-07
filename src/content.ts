import Message from "./message.ts";

function html2dom(html: string): Element {
  const dom = new DOMParser().parseFromString(html, "text/html").body
    .firstElementChild!;
  return dom;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function remove(elm: Element, ms: number) {
  await elm
    .animate({ opacity: [100, 0] }, ms)
    .finished.then(() => elm.remove());
}

function addStyle(elm: Element, style: string) {
  const original = elm.getAttribute("style") ?? "";
  elm.setAttribute("style", original + style);
}

async function showMessage(message: Message) {
  const div =
    html2dom(`<div class="downloaded-csv-to-clipboard">${message.text}<div>
`); // #dc143c #4169e1
  const bgcolor = message.level === 0 ? "#4169e1" : "#dc143c";
  addStyle(div, `background-color: ${bgcolor};`);
  addStyle(div, "color: #FFFFFF;");
  addStyle(div, "position: fixed;");
  addStyle(div, "bottom: 20px; right: 20px;");
  addStyle(div, "padding: 5px 10px;"); // vertical horizontal
  addStyle(div, "font-size: 30px;");
  addStyle(
    div,
    "font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;"
  );
  document.body.append(div);
  await sleep(3000);
  await remove(div, 1000);
}

chrome.runtime.onMessage.addListener((message) => {
  showMessage(message);
});
