/**
 * Når det er utført et søk, oppdateres antall treff per fasett, f.eks "Oslo (25)"
 *
 * @param initialValues: Alle opprinnelige fasetter
 * @param newValues: Oppdaterte fasetter fra backend
 * @param nestedKey (Optional): Navn på evt. underkategori som også skal oppdateres, f. eks municipal
 * @returns Returnerer en ny liste, hvor antall treff per fasett er oppdatert
 */
export default function mergeCount(initialValues, newValues, nestedKey) {
    if (nestedKey === undefined) {
        return initialValues.map((item) => {
            const found = newValues.find((e) => (
                e.key === item.key
            ));
            return {
                ...item,
                count: found ? found.count : 0
            };
        })
    }
    return initialValues.map((firstLevel) => {
        const foundFirstLevel = newValues.find((c) => (
            c.key === firstLevel.key
        ));
        return {
            ...firstLevel,
            count: foundFirstLevel ? foundFirstLevel.count : 0,
            [nestedKey]: firstLevel[nestedKey].map((secondLevel) => {
                let newSecondLevelCount = 0;
                if (foundFirstLevel) {
                    const foundSecondLevel = foundFirstLevel[nestedKey].find((m) => (
                        m.key === secondLevel.key
                    ));
                    newSecondLevelCount = foundSecondLevel ? foundSecondLevel.count : 0;
                }
                return {
                    ...secondLevel,
                    count: newSecondLevelCount
                };
            })
        };
    })
}
