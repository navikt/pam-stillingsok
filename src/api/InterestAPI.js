async function getRequirements(adUuid) {
    if (!shouldEnableInterestFeature(adUuid)) {
        return Promise.reject("Requirements not supported for this ad");
    }
    return Promise.resolve({
        hardRequirements: [{ label: "B-førerkort" }, { label: "Truckførerkort" }],
        softRequirements: [
            { label: "Komp A" },
            { label: "Kompetanse B" },
            { label: "Kompetanse C" },
            { label: "Komp D" },
            { label: "Lang kompetanse E" },
            { label: "Lang kompetanse F" }
        ]
    });
}

async function postInterest(interest) {
    return new Promise((resolve) => setTimeout(resolve, 1000));
}

function shouldEnableInterestFeature(uuid) {
    return ["5bbed2b3-4401-454a-9d22-8e599490c7fa", "88209a94-bf03-44df-ae51-3fdd941d17f7"].includes(uuid);
}

const InterestAPI = {
    getRequirements: getRequirements,
    postInterest: postInterest,
    shouldEnableInterestFeature: shouldEnableInterestFeature
};

export default InterestAPI;
