const capitalizeLocation = require('./capitalizeLocation');

exports.getWorkLocation = function getWorkLocation(propertyLocation, locationList, hidePostAddress = true) {
    if (propertyLocation) {
        return propertyLocation;
    }

    if (!locationList) {
        return '';
    }

    const workLocations = [];
    for (let i = 0; i < locationList.length; i += 1) {
        if (locationList[i].city && hidePostAddress) {
            workLocations.push(capitalizeLocation.capitalizeLocation(locationList[i].city));
        } else if (locationList[i].postalCode) {
            let tmp = locationList[i].address ? `${locationList[i].address}, ` : '';
            tmp += `${locationList[i].postalCode} ${capitalizeLocation.capitalizeLocation(locationList[i].city)}`;
            workLocations.push(tmp);
        } else if (locationList[i].municipal) {
            workLocations.push(capitalizeLocation.capitalizeLocation(locationList[i].municipal));
        } else if (locationList[i].county) {
            workLocations.push(capitalizeLocation.capitalizeLocation(locationList[i].county));
        } else if (locationList[i].country) {
            workLocations.push(capitalizeLocation.capitalizeLocation(locationList[i].country));
        }
    }

    return workLocations.join(', ');
};
