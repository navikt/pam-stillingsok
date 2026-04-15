export default function getRemoteWorkValue(value: string) {
    switch (value) {
        case "Hjemmekontor":
            return "Kun hjemmekontor";
        case "Hybridkontor":
            return "Delvis hjemmekontor";
        case "Hjemmekontor ikke mulig":
            return "Ingen mulighet for hjemmekontor";
        default:
            return value;
    }
}
