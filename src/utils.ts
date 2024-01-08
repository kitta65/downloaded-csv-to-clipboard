import Papa from "papaparse";

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function csv2tsv(csv: string): string {
  const parsed = Papa.parse(csv);
  const tsv = Papa.unparse(parsed.data, { delimiter: "\t", newline: "\n" });
  return tsv;
}

export async function getTsv(filename: string) {
  const response = await fetch(`file:///${filename}`);
  const csv = await response.text();
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
