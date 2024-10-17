export type AdDTORAW = {
    reference: string | undefined;
    locationList: Location[];
    expires: string | undefined;
    businessName: string | undefined;
    id: number | undefined;
    source: string | undefined;
    medium: string | undefined;
    published: string | undefined;
    title: string | undefined;
    updated: string | undefined;
    status: string | undefined;
    employer: EmployerDTO;
    contactList: ContactDTO[];
    categoryList: CategoryDTO[];
    properties: Properties;
};
export type ElasticSearchAdResult = {
    _index: string;
    _id: string;
    _version: number;
    _seq_no: number;
    _primary_term: number;
    found: true;
    _source: AdDTORAW;
};
export type ApiResponse<T> =
    | { success: true; status: number; data: T }
    | { success: false; status: number; error: string };

export type Response<Data> =
    | {
          ok: true;
          status: 200;
          data: Data;
      }
    | {
          ok: false;
          status: number;
          data?: undefined;
      };

export type Properties = {
    extent: string;
    workhours: string;
    education: string[];
    workday: string;
    applicationdue: string;
    jobtitle: string;
    positioncount: string;
    engagementtype: string;
    employerdescription: string;
    starttime: string;
    remote: string;
    adtext: string;
    needDriversLicense: string[];
    hasInterestform: string;
    workLanguage: string[];
    applicationemail: string;
    adtextFormat: string;
    applicationurl: string;
    employer: string;
    sector: string;
    address: string;
    employerhomepage: string;
    linkedinpage: string;
    twitteraddress: string;
    facebookpage: string;
    sourceurl: string;
    jobarrangement: string;
    jobpercentage: string;
    jobpercentagerange: string;
    location: string;
    searchtags: { label: string; score: number }[] | undefined;
    experience: string[];
};

export type Location = {
    address?: string;
    postalCode?: string;
    county?: string;
    municipal?: string;
    municipalCode?: string;
    city?: string;
    country?: string;
};
export type UrlDTO =
    | { url: string; dangerouslyInvalidUrl?: undefined }
    | { dangerouslyInvalidUrl: string; url?: undefined }
    | undefined;

export type EmployerDTO = {
    locationList?: Location[];
    name: string | undefined;
    orgnr?: string | undefined;
    sector: string | undefined;
    homepage: UrlDTO;
    linkedinPage: UrlDTO;
    twitterAddress: UrlDTO;
    facebookPage: UrlDTO;
    description: string;
    location?: string;
};
export type ContactDTO = {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    title?: string;
};

export type AdDTO = {
    reference?: string;
    adText: string;
    locationList: Location[];
    expires: Date | undefined;
    businessName: string | undefined;
    id: number | undefined;
    source: string | undefined;
    medium: string | undefined;
    published: Date | undefined;
    title: string | undefined;
    updated: Date | undefined;
    status: string | undefined;
    employer: EmployerDTO;
    contactList?: ContactDTO[];
    categoryList?: CategoryDTO[];
};

export type MappedAdDTO = {
    id: string | undefined;
    status: string | undefined;
    title: string | undefined;
    adText: string | undefined;
    published: Date | undefined;
    expires: Date | undefined;
    updated: Date | undefined;
    source: string | undefined;
    reference: string | undefined;
    medium: string | undefined;
    applicationDue: string | undefined;
    applicationEmail: string | undefined;
    applicationUrl: UrlDTO | undefined;
    sourceUrl: UrlDTO | undefined;
    hasSuperraskSoknad: string;
    jobPostingFormat: string | undefined;
    adNumber: number | undefined;
    businessName: string | undefined;

    // employment details
    engagementType: string | undefined;
    extent: string | string[] | undefined;
    jobArrangement: string | undefined;
    jobPercentage: string | undefined;
    jobPercentageRange: string | undefined;
    jobTitle: string | undefined;
    positionCount: string | undefined;
    remote: string | undefined;
    startTime: string | undefined;
    workdays: string | undefined;
    workHours: string | undefined;
    workLanguages: string[] | undefined;
    locationList: Location[] | undefined;
    location: string | undefined;

    // Employer
    employer: EmployerDTO | undefined;
    contactList: ContactDTO[] | undefined;

    // For debugging
    categoryList: CategoryDTO[] | undefined;
    searchtags: { label: string; score: number }[] | undefined;
    education: string[] | undefined;
    experience: string[] | undefined;
    needDriversLicense: string[] | undefined;
};

export type CategoryDTO = {
    id?: number;
    code: string;
    categoryType: string;
    name: string;
    description?: string | null;
    parentId?: number | null;
};

export type OpenGraphImage = {
    url: string;
    width: number;
    height: number;
};
export type OpenGraph = {
    title: string;
    description: string;
    images?: OpenGraphImage[];
};
export type FormatDetection = {
    telephone: boolean;
    date: boolean;
    email: boolean;
    address: boolean;
};

export type Metadata = {
    title: string;
    description?: string;
    openGraph?: OpenGraph;
    icons?: {
        icon: string;
    };
    formatDetection?: FormatDetection;
    robots?: string;
    alternates?: {
        canonical: string;
    };
};
