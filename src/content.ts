import icon from "../images/icon-32.png";

function html2dom(html: string): Element {
  const dom = new DOMParser().parseFromString(html, "text/html").body
    .firstElementChild!;
  return dom;
}

function addStyle(elm: Element, style: string) {
  const original = elm.getAttribute("style") ?? "";
  elm.setAttribute("style", original + style);
}

function createImg(): Element {
  const url = chrome.runtime.getURL(icon);
  const html = `<img src="${url}" alt="Downloaded CSV to Clipboard">`;
  const img = html2dom(html);
  addStyle(img, "position: fixed;");
  addStyle(img, "bottom: 20px; right: 20px;");
  return img;
}

chrome.runtime.onMessage.addListener((data) => {
  const img = createImg();
  img.addEventListener("click", async () => {
    window.navigator.clipboard.writeText(data);
    alert("copied!");
  });
  document.body.append(img);
  img
    .animate({ opacity: [0, 100, 0, 100, 0, 100, 0] }, 5 * 1000)
    .finished.then(() => img.remove());
});
