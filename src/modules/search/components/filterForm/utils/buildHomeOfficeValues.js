export default function buildHomeOfficeValues(remote) {
    const count = remote && remote.hjemmekontor && remote.hjemmekontor.doc_count ? remote.hjemmekontor.doc_count : 0;

    const facets = [
        {
            key: "Hjemmekontor",
            count
        }
    ];

    return facets;
}
