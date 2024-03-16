import Papa from "papaparse";
import chardet from "chardet";

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function csv2tsv(csv: string): string {
  const parsed = Papa.parse(csv);
  const tsv = Papa.unparse(parsed.data, { delimiter: "\t", newline: "\n" });
  return tsv;
}

export function arrayBuffer2string(buffer: ArrayBuffer): string {
  const encoding = chardet.detect(new Uint8Array(buffer));
  let decoder;
  try {
    decoder = new TextDecoder(encoding || "utf-8");
  } catch (e) {
    // TextDecoder does not support some encodings (e.g. UTF-32 LE).
    console.log(e);
    decoder = new TextDecoder("utf-8");
  }
  return decoder.decode(buffer);
}

export function encodeFilePath(abspath: string) {
  const delimiter = abspath.startsWith("/") ? "/" : "\\";
  const splitted = abspath.split(delimiter);
  const encoded = splitted.map((x) => encodeURIComponent(x)).join(delimiter);
  return encoded;
}

export async function getTsv(abspath: string) {
  const encoded = encodeFilePath(abspath);
  const response = await fetch(`file:///${encoded}`);
  const csv = await response
    .arrayBuffer()
    .then((buffer) => arrayBuffer2string(buffer));
  const tsv = csv2tsv(csv);
  return tsv;
}

export type ItemStatus =
  | "ready"
  | "processing"
  | "done"
  | "large"
  | "unknown"
  | "removed";

export function getItemStatus(item: chrome.downloads.DownloadItem): ItemStatus {
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
}
