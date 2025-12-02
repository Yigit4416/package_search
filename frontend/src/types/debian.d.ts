export type AptSearchResult = {
  query: string
  results: {
    exact: { name: string } | null
    other: { name: string }[] | null
  }
  suite: string
}

export type DebianPackageVersion = {
  area: "main" | "contrib" | "non-free" | string; // Union type for common areas, allowing string fallback
  suites: string[];
  version: string;
}

export type DebianPackageInfo = {
  package: string;
  path: string;
  /*
   * A list of tuples representing the path hierarchy.
   * Example: ["steam", "/src/steam"]
   */
  pathl: [string, string][];
  suite: string;
  type: string;
  versions: DebianPackageVersion[];
}
