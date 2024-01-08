import { describe, expect, test } from "vitest";
import { csv2tsv } from "./utils";

describe("csv2tsv", () => {
  test("simple csv", () => {
    expect(csv2tsv("a,b\n1,2")).toBe("a\tb\n1\t2");
  });
});
