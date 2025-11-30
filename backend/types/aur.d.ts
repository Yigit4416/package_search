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