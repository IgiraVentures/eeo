import { describe, expect, it } from "vitest";

import { canonicalizeEeoJson, EeoJsonCanonicalizationError } from "@/lib/eeoJsonCanonicalization";

describe("canonicalizeEeoJson", () => {
  it("sorts object keys recursively while preserving array order", () => {
    const first = {
      z: 2,
      a: {
        y: true,
        b: ["second", "first"],
      },
    };
    const second = {
      a: {
        b: ["second", "first"],
        y: true,
      },
      z: 2,
    };

    expect(canonicalizeEeoJson(first)).toBe(canonicalizeEeoJson(second));
    expect(canonicalizeEeoJson(first)).toBe(
      '{"a":{"b":["second","first"],"y":true},"z":2}'
    );
    expect(canonicalizeEeoJson({ values: ["a", "b"] })).not.toBe(
      canonicalizeEeoJson({ values: ["b", "a"] })
    );
  });

  it("does not normalize string content", () => {
    const composed = "\u00e9";
    const decomposed = "e\u0301";

    expect(canonicalizeEeoJson({ value: composed })).not.toBe(
      canonicalizeEeoJson({ value: decomposed })
    );
  });

  it.each([
    { label: "undefined", value: { value: undefined } },
    { label: "non-finite", value: { value: Number.NaN } },
    { label: "date", value: { value: new Date("2026-09-30T00:00:00Z") } },
  ])("fails closed for unsupported $label values", ({ value }) => {
    expect(() => canonicalizeEeoJson(value)).toThrow(
      EeoJsonCanonicalizationError
    );
  });

  it("fails closed for sparse arrays and custom array properties", () => {
    const sparse = new Array(2);
    sparse[1] = "value";

    const custom = ["value"] as string[] & { extra?: string };
    custom.extra = "not part of JSON array semantics";

    expect(() => canonicalizeEeoJson(sparse)).toThrow(
      EeoJsonCanonicalizationError
    );
    expect(() => canonicalizeEeoJson(custom)).toThrow(
      EeoJsonCanonicalizationError
    );
  });

  it("fails closed for cyclic input", () => {
    const value: Record<string, unknown> = {};
    value.self = value;

    expect(() => canonicalizeEeoJson(value)).toThrow(
      EeoJsonCanonicalizationError
    );
  });
});
