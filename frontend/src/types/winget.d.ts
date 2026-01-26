export type WingetPackage = {
  Id: string;
  Versions: WingetVersion[];
  Latest: {
    Name: string;
    Publisher: string;
    Tags: string[];
    Description: string;
    Homepage: string;
    License: string;
    LicenseUrl: string;
  };
  Featured: boolean;
  IconUrl: string | null;
  Banner: string | null;
  Logo: string | null;
  // Usually, pick one casing style for your internal API
  updatedAt: string;
  createdAt: string;
  SearchScore: number;
};

type WingetVersion = {
  version: string;
}

export type WingetQueryResponse = {
  query: string;
  // Use optional (?) so TypeScript forces you to check if 'data' exists
  data?: {
    Packages: WingetPackage[];
  };
  message?: string; // To capture the "Can't find package" string
};
