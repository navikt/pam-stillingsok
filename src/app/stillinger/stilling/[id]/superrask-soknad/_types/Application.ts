export interface Application {
    name: string;
    telephone: string;
    email: string;
    qualifications: Qualification[];
    motivation: string;
}

export interface ApplicationForm {
    adId: string;
    qualifications: Qualification[];
}

export interface Qualification {
    id: string;
    label: string;
}

export interface ValidateApplicationRequest {
    token: string;
}
