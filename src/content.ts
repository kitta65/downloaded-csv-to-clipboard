function html2dom(html: string): Element {
  const dom = new DOMParser().parseFromString(html, "text/html").body
    .firstElementChild!;
  return dom;
}

chrome.runtime.onMessage.addListener((msg) => {
  document.body.append(
  html2dom(
    `
<div
  style="position: fixed; bottom: 10px; right: 10px; background-color: #dc143c; color: #FFFFFF; padding: 10px 20px; font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif; font-size: 1.75em"
  class="downloaded-csv-to-clipboard"
>${msg}<div>
`
  ) // #dc143c #4169e1
  );
});
