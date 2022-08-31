async function getRequirements(id) {
    return Promise.resolve({
        hardRequirements: [
            { label: "B-førerkort" },
            { label: "Truckførerkort" }
        ],
        softRequirements: [
            { label: "Kompetanse A" },
            { label: "Kompetanse B" },
            { label: "Kompetanse C" },
            { label: "Kompetanse D" },
            { label: "Kompetanse E" }
        ]
    })
    //return await get(`url`);
}

async function postInterest(interest) {
    return new Promise(resolve => setTimeout(resolve, 1000))
}

const InterestAPI = {
    getRequirements: getRequirements,
    postInterest: postInterest
};

export default InterestAPI;
