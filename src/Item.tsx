import Papa from "papaparse";

type Props = {
  item: chrome.downloads.DownloadItem;
};

function basename(path: string): string {
  // https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
  return path.split("\\").pop()!.split("/").pop()!;
}

function csv2tsv(csv: string): string {
  const parsed = Papa.parse(csv);
  const tsv = Papa.unparse(parsed.data, { delimiter: "\t" });
  return tsv;
}

export default function Item(props: Props) {
  async function handleClick() {
    const item = props.item;
    // check file size
    if (
      // TODO check if removed
      item.totalBytes < 0 ||
      1 * 1024 ** 2 < item.totalBytes // 1MB
    ) {
      const msg = `${item.filename} is too large or unknown`;
      console.log(msg);
      return;
    }

    const response = await fetch(`file:///${item.filename}`);
    const csv = await response.text();
    const tsv = csv2tsv(csv);
    window.navigator.clipboard.writeText(tsv);
  }

  return <p onClick={handleClick}>{basename(props.item.filename)}</p>;
}
