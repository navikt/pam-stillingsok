export type WithdrawResponse = {
    success: boolean;
    error?: string;
};

export type JobAdvertisment = {
    _index: string;
    _id: string;
    _version: number;
    _seq_no: number;
    _primary_term: number;
    found: boolean;
    _source: {
        title: string;
    };
};
