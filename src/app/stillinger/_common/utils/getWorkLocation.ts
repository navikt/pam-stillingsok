import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import { LocationDTO } from "@/app/stillinger/_common/lib/stillingSchema";

function getWorkLocation(
    propertyLocation: string | undefined,
    locationList: LocationDTO[] | undefined,
    hidePostAddress = true,
) {
    if (!locationList && propertyLocation) {
        return propertyLocation;
    }

    if (!locationList) {
        return "";
    }

    const workLocations = [];
    for (let i = 0; i < locationList.length; i += 1) {
        if (locationList[i].city && hidePostAddress) {
            workLocations.push(fixLocationName(locationList[i].city));
        } else if (locationList[i].postalCode) {
            let tmp = locationList[i].address ? `${locationList[i].address}, ` : "";
            tmp += `${locationList[i].postalCode} ${fixLocationName(locationList[i].city)}`;
            workLocations.push(tmp);
        } else if (locationList[i].municipal) {
            workLocations.push(fixLocationName(locationList[i].municipal));
        } else if (locationList[i].county) {
            workLocations.push(fixLocationName(locationList[i].county));
        } else if (locationList[i].country) {
            workLocations.push(fixLocationName(locationList[i].country));
        }
    }

    return workLocations.join(", ");
}

export default getWorkLocation;
