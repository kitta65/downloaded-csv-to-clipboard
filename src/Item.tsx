type Props = {
  item: chrome.downloads.DownloadItem;
};

function basename(path: string) {
  // https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
  return path.split("\\").pop()!.split("/").pop()!;
}

export default function Item(props: Props) {
  return <p>{basename(props.item.filename)}</p>;
}
