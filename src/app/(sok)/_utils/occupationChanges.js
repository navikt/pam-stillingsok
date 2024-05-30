/* eslint-disable no-restricted-syntax */

// changeOccupations is supposed to be in the format: Key:[Values]
// Key = Old occupation
// Values = New occupation/s
function assertChangedOccupationsCorrectFormat(changedOccupations) {
    for (const occupation in changedOccupations) {
        if (!Array.isArray(changedOccupations[occupation])) {
            throw new Error(`New occupations for ${occupation} must be an array`);
        }
    }
}

export function containsOldOccupations(searchParams, changedOccupations) {
    assertChangedOccupationsCorrectFormat(changedOccupations);

    const firstLevels = getOccupationFirstLevels(searchParams);
    const secondLevels = getOccupationSecondLevels(searchParams);

    if (firstLevels.length === 0 || secondLevels.length === 0) {
        return false;
    }

    for (const secondLevel of secondLevels) {
        if (getChangedSecondLevelOccupations(changedOccupations).includes(secondLevel)) {
            return true;
        }
    }

    return false;
}

export function rewriteOccupationSearchParams(searchParams, changedOccupations) {
    assertChangedOccupationsCorrectFormat(changedOccupations);

    const initialSecondLevels = getOccupationSecondLevels(searchParams);
    const onlyInFirstLevel = getOccupationsOnlyInFirstLevel(searchParams);

    const newSecondLevels = initialSecondLevels
        .map((secondLevel) => {
            if (getChangedSecondLevelOccupations(changedOccupations).includes(secondLevel)) {
                return changedOccupations[secondLevel];
            }
            return secondLevel;
        })
        .flat();

    const firstLevelsFromNewSecondLevels = newSecondLevels.map((secondLevel) => secondLevel.split(".")[0]);

    const newFirstLevels = [...new Set([...onlyInFirstLevel, ...firstLevelsFromNewSecondLevels])];

    return {
        ...searchParams,
        "occupationFirstLevels[]": newFirstLevels,
        "occupationSecondLevels[]": newSecondLevels,
    };
}

export function getOccupationsOnlyInFirstLevel(searchParams) {
    const firstLevels = getOccupationFirstLevels(searchParams);
    const secondLevels = getOccupationSecondLevels(searchParams);

    return firstLevels.filter((firstLevel) => {
        for (const secondLevel of secondLevels) {
            if (secondLevel.indexOf(firstLevel) !== -1) {
                return false;
            }
        }

        return true;
    });
}

function getOccupationFirstLevels(searchParams) {
    return toArray(searchParams["occupationFirstLevels[]"]);
}

function getOccupationSecondLevels(searchParams) {
    return toArray(searchParams["occupationSecondLevels[]"]);
}

function toArray(value) {
    if (value === undefined) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function getChangedSecondLevelOccupations(searchParams) {
    return Object.keys(searchParams);
}
