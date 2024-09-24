export interface Application {
    name: string;
    telephone: string;
    email: string;
    qualifications: Qualification[];
    motivation: string;
}

export interface Qualification {
    id: string;
    label: string;
}
