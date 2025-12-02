/**
 * The standard wrapper for AUR responses.
 */
export type AurResponse = {
  version: number;
  type: 'search' | 'info' | 'error';
  resultcount: number;
  results: AurPackage[];
  error?: string;
}

/**
 * Detailed information for an AUR package.
 */
export type AurPackage = {
  ID: number;
  Name: string;
  PackageBaseID: number;
  PackageBase: string;
  Version: string;
  Description: string;
  URL: string;
  NumVotes: number;
  Popularity: number;

  /** Timestamp (seconds since epoch) */
  OutOfDate: number | null;

  Maintainer: string | null;

  /** Timestamp (seconds since epoch) */
  FirstSubmitted: number;

  /** Timestamp (seconds since epoch) */
  LastModified: number;

  URLPath: string; // Path to the snapshot
  Depends?: string[];
  MakeDepends?: string[];
  OptDepends?: string[];
  CheckDepends?: string[];
  Conflicts?: string[];
  Provides?: string[];
  License?: string[];
  Keywords?: string[];
}

export type AurQueryResponse = {
  query: string
  data: AurPackage[]
}

/**
 * Represents the Architecture (usually x86_64 or any)
 */
export type ArchArchitecture = 'x86_64' | 'any' | string;

/**
 * Represents the Official Repository (Core, Extra, Multilib, etc.)
 */
export type ArchRepository = 'core' | 'extra' | 'multilib' | 'multilib-testing' | 'testing' | string;

/**
 * Detailed information for a single package
 */
export type ArchPackage = {
  pkgname: string;
  pkgbase: string;
  repo: ArchRepository;
  arch: ArchArchitecture;
  pkgver: string;
  pkgrel: string;
  epoch: number;
  pkgdesc: string;
  url: string;
  filename: string;

  /** Size in bytes of the compressed package file (.tar.zst) */
  compressed_size: number;

  /** Size in bytes of the installed content */
  installed_size: number;

  /** ISO 8601 Date String */
  build_date: string;

  /** ISO 8601 Date String */
  last_update: string;

  /** ISO 8601 Date String. Null if the package is not flagged out-of-date. */
  flag_date: string | null;

  maintainers: string[];
  packager: string;
  groups: string[];
  licenses: string[];
  conflicts: string[];
  provides: string[];
  replaces: string[];

  /** List of dependencies (e.g. "libuv", "libvterm>=0.3.3") */
  depends: string[];

  /** Optional dependencies with descriptions (e.g. "xclip: for clipboard support") */
  optdepends: string[];

  makedepends: string[];
  checkdepends: string[];
}

/**
 * The API response wrapper from https://archlinux.org/packages/search/json/
 */
export type ArchPackageSearchResponse = {
  version: number;
  limit: number;
  valid: boolean;
  results: ArchPackage[];
  num_pages: number;
  page: number;
}

export type ArchPackageQueryResponse = {
  query: string
  data: ArchPackage[]
}
