import { describe, expect, test } from "vitest";
import { csv2tsv, arrayBuffer2string, encodeFilePath } from "./utils";

describe("csv2tsv", () => {
  test("simple", () => {
    expect(csv2tsv("a,b\n1,2\n3,4")).toBe("a\tb\n1\t2\n3\t4");
  });
  test("hiragana", () => {
    expect(csv2tsv("あ,い\nう,え")).toBe("あ\tい\nう\tえ");
  });
  test("quoted", () => {
    expect(csv2tsv('"a","b"\n"1","2"')).toBe("a\tb\n1\t2"); // should be unquoted
  });
});

describe("arrayBuffer2string", () => {
  test("UTF-8", () => {
    expect(
      arrayBuffer2string(
        new Uint8Array([
          227, 129, 138, 227, 129, 175, 227, 130, 136, 227, 129, 134,
        ]).buffer,
      ),
    ).toBe("おはよう");
  });
  test("Shift_JIS", () => {
    expect(
      arrayBuffer2string(
        new Uint8Array([130, 168, 130, 205, 130, 230, 130, 164]).buffer,
      ),
    ).toBe("おはよう");
  });
});

describe("encode file path", () => {
  test("NOP", () => {
    expect(encodeFilePath("filename.csv")).toBe("filename.csv");
  });
  test("white space", () => {
    expect(encodeFilePath("filename (1).csv")).toBe("filename%20(1).csv");
  });
  test("sharp", () => {
    expect(encodeFilePath("filename#1.csv")).toBe("filename%231.csv");
  });
  test("windows style", () => {
    expect(encodeFilePath("C:\\Users\\username\\Downloads\\filename.csv")).toBe(
      "C%3A\\Users\\username\\Downloads\\filename.csv",
    );
  });
  test("windows style", () => {
    expect(encodeFilePath("/Users/username/Downloads/filename.csv")).toBe(
      "/Users/username/Downloads/filename.csv",
    );
  });
});
