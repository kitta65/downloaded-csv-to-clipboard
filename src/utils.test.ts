import { describe, expect, test } from "vitest";
import { csv2tsv } from "./utils";

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
