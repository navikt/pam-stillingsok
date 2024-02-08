/* eslint-disable */
import React from "react";
import "../../app/(sok)/_components/search.css";

function SearchPage() {
    /**
     * Når man laster inn flere annonser, kan en allerede lastet annonse komme på nytt. Dette kan f.eks skje
     * ved at annonser legges til/slettes i backend, noe som fører til at pagineringen og det faktiske datasettet
     * blir usynkronisert. Funskjonen fjerner derfor duplikate annonser i søkeresultatet.
     */
    // todo: mulig vi ikke trenger denne? Ola sjekker
    function mergeAndRemoveDuplicates(searchResponse, searchResponseLocal, response) {
        return {
            ...response,
            ads: [
                ...searchResponse.data.ads,
                ...response.ads.filter((a) => {
                    const duplicate = searchResponseLocal.data.ads.find((b) => a.uuid === b.uuid);
                    return !duplicate;
                }),
            ],
        };
    }

    return <div />;
}

export default SearchPage;
