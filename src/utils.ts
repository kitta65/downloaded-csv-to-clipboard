import Papa from "papaparse";

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function csv2tsv(csv: string): string {
  const parsed = Papa.parse(csv);
  const tsv = Papa.unparse(parsed.data, { delimiter: "\t", newline: "\n" });
  return tsv;
}
