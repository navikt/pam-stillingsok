export type SommerjobbQuery = {
    q: string[];
    from: number;
    municipal?: string;
    county?: string;
    size?: number;
    under18?: boolean;
};
