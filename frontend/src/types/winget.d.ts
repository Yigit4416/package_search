export type WingetPackage = {
  Id: string;
  Versions: Versions[];
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
  UpdatedAt: string;
  CreatedAt: string;
  createdAt: string;
  updatedAt: string;
  SearchScore: number;
};

type Versions = {
  version: string;
}

export type WingetQueryResponse = {
  query: string;
  data: {
    Packages: WingetPackage[];
  };
};
