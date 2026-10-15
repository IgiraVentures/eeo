export type EeoJsonPrimitive = null | boolean | number | string;
export type EeoJsonValue =
  | EeoJsonPrimitive
  | EeoJsonValue[]
  | { [key: string]: EeoJsonValue };

export class EeoJsonCanonicalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EeoJsonCanonicalizationError";
  }
}

function fail(path: string, reason: string): never {
  throw new EeoJsonCanonicalizationError(
    `Cannot canonicalize ${path}: ${reason}.`
  );
}

function canonicalizeValue(
  value: unknown,
  path: string,
  ancestors: WeakSet<object>
): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return fail(path, "non-finite numbers are not valid eeo-json-v1 values");
    }
    return JSON.stringify(value);
  }

  if (
    typeof value === "undefined" ||
    typeof value === "bigint" ||
    typeof value === "symbol" ||
    typeof value === "function"
  ) {
    return fail(path, `${typeof value} values are not supported`);
  }

  if (ancestors.has(value)) {
    return fail(path, "cyclic references are not supported");
  }

  ancestors.add(value);

  try {
    if (Array.isArray(value)) {
      if (Object.getOwnPropertySymbols(value).length > 0) {
        return fail(path, "symbol-keyed array properties are not supported");
      }

      const arrayPropertyNames = Object.getOwnPropertyNames(value);
      if (arrayPropertyNames.length !== value.length + 1) {
        return fail(path, "sparse arrays or custom array properties are not supported");
      }

      const items: string[] = [];
      for (let index = 0; index < value.length; index += 1) {
        const key = String(index);
        const descriptor = Object.getOwnPropertyDescriptor(value, key);

        if (!descriptor) {
          return fail(path, "sparse arrays are not supported");
        }
        if (descriptor.get || descriptor.set) {
          return fail(path, "array accessor properties are not supported");
        }

        items.push(
          canonicalizeValue(value[index], `${path}[${index}]`, ancestors)
        );
      }

      return `[${items.join(",")}]`;
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      return fail(
        path,
        "only plain objects, arrays, and JSON primitives are supported"
      );
    }

    if (Object.getOwnPropertySymbols(value).length > 0) {
      return fail(path, "symbol-keyed properties are not supported");
    }

    const names = Object.getOwnPropertyNames(value);
    const enumerableNames = Object.keys(value);

    if (names.length !== enumerableNames.length) {
      return fail(path, "non-enumerable properties are not supported");
    }

    for (const name of names) {
      const descriptor = Object.getOwnPropertyDescriptor(value, name);
      if (descriptor?.get || descriptor?.set) {
        return fail(path, "accessor properties are not supported");
      }
    }

    const objectValue = value as Record<string, unknown>;
    const entries = names
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalizeValue(
            objectValue[key],
            `${path}.${key}`,
            ancestors
          )}`
      );

    return `{${entries.join(",")}}`;
  } finally {
    ancestors.delete(value);
  }
}

/**
 * Deterministic JSON serialization for version-bound EEO review objects.
 *
 * eeo-json-v1 rules:
 * - object keys are sorted lexicographically;
 * - array order is preserved;
 * - strings are not Unicode-normalized or otherwise rewritten;
 * - finite JSON numbers use JSON.stringify semantics;
 * - undefined, bigint, symbols, functions, accessors, non-enumerable
 *   properties, non-plain objects, non-finite numbers, and cycles fail closed.
 *
 * Callers must pass an explicitly defined governed review scope. This function
 * must not be used to silently strip private or volatile fields.
 */
export function canonicalizeEeoJson(value: unknown): string {
  return canonicalizeValue(value, "$", new WeakSet<object>());
}
