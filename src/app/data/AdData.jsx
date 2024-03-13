import EmployerData from "@/app/data/EmployerData";

class AdData {
    #id;
    #status;

    // Ad Details
    #title;
    #text;
    #published;
    #reference;

    // Employment Details
    #engagementType;
    #extent;
    #jobArrangement;
    #jobPercentage;
    #jobTitle;
    #positionCount;
    #remote;
    #sector;
    #startTime;
    #workDay;
    #workHours;
    #workLanguages;

    #employer;

    constructor(
        id,
        status,
        title,
        text,
        published,
        reference,
        engagementType,
        extent,
        jobArrangement,
        jobPercentage,
        jobTitle,
        positionCount,
        remote,
        sector,
        startTime,
        workDay,
        workHours,
        workLanguages,
        employer,
    ) {
        this.#id = id;
        this.#status = status;
        this.#title = title;
        this.#text = text;
        this.#published = published;
        this.#reference = reference;
        this.#engagementType = engagementType;
        this.#extent = extent;
        this.#jobArrangement = jobArrangement;
        this.#jobPercentage = jobPercentage;
        this.#jobTitle = jobTitle;
        this.#positionCount = positionCount;
        this.#remote = remote;
        this.#sector = sector;
        this.#startTime = startTime;
        this.#workDay = workDay;
        this.#workHours = workHours;
        this.#workLanguages = workLanguages;
        this.#employer = employer;
    }

    static fromQuery(queryData) {
        const data = queryData._source ? queryData._source : queryData ? queryData : undefined;
        if (!data) {
            return undefined;
        }
        const { properties } = data;
        if (!properties) {
            return undefined;
        }

        return new AdData(
            data.id,
            data.status,
            data.title,
            properties.adtext,
            data.published,
            data.reference,
            properties.engagementType,
            properties.extent,
            properties.jobarrangement,
            properties.jobpercentage,
            properties.jobtitle,
            properties.positioncount,
            properties.remote,
            properties.sector,
            properties.startTime,
            properties.workday,
            properties.workhours,
            properties.workLanguage, // list of strings
            (properties.employer = EmployerData.fromQuery(data)),
        );
    }

    getWorkLocation() {
        // Summary component uses this, see it for details
    }

    formatWorkLanguage() {
        // EmploymentDetails component uses this, see it for details
    }
}
