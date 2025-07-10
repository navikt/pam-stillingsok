import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import logger from "@/app/stillinger/_common/utils/logger";
import {
    StillingDetaljer,
    transformElasticRawToAdData,
    transformAdData,
} from "@/app/stillinger/_common/lib/stillingSchema";
import { notFound } from "next/navigation";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { validate as uuidValidate } from "uuid";

// Expose only necessary data to client
const sourceIncludes = [
    "businessName",
    "contactList.email",
    "contactList.name",
    "contactList.phone",
    "contactList.title",
    "employer.name",
    "employer.orgnr",
    "expires",
    "id",
    "locationList.postalCode",
    "locationList.city",
    "locationList.address",
    "locationList.municipal",
    "locationList.county",
    "locationList.country",
    "medium",
    "properties.adtext",
    "properties.address",
    "properties.adtextFormat",
    "properties.applicationdue",
    "properties.applicationemail",
    "properties.applicationurl",
    "properties.employer",
    "properties.employerdescription",
    "properties.employerhomepage",
    "properties.engagementtype",
    "properties.extent",
    "properties.facebookpage",
    "properties.hasInterestform",
    "properties.jobarrangement",
    "properties.jobpercentage",
    "properties.jobpercentagerange",
    "properties.jobtitle",
    "properties.linkedinpage",
    "properties.location",
    "properties.positioncount",
    "properties.remote",
    "properties.sector",
    "properties.sourceurl",
    "properties.starttime",
    "properties.twitteraddress",
    "properties.workday",
    "properties.workhours",
    "properties.workLanguage",
    "published",
    "reference",
    "source",
    "status",
    "title",
    "updated",
    "categoryList", // For debugging
    "properties.searchtags", // For debugging
    "properties.needDriversLicense", // For debugging
    "properties.under18", // For debugging
    "properties.education", // For debugging
    "properties.experience", // For debugging
].join(",");

/**
 * Returns a javascript object containing job posting data
 * @param id - the id of job posting
 * @returns Promise<Response<StillingDetaljer>>
 */
export async function getAdData(id: string): Promise<StillingDetaljer> {
    if (!uuidValidate(id)) {
        notFound();
    }

    const a = {
        _index: "ad-202506121307",
        _id: "cdf3b437-ee01-40d6-a46d-c866d29cf004",
        _version: 1,
        _seq_no: 27131,
        _primary_term: 1,
        found: true,
        _source: {
            expires: "2025-06-01T00:08:18.332287444+02:00",
            businessName: "Restaurant Bjørk",
            published: "2025-05-07T13:53:34.974319+02:00",
            medium: "mojob",
            source: "IMPORTAPI",
            title: "Head Chef Position at Restaurant Bjørk",
            reference: "1805d368-1374-46f8-b8dd-f4f5ce25526d",
            locationList: [
                {
                    country: "NORGE",
                    address: "8005 Bodø, Norway",
                    city: "BODØ",
                    postalCode: "8005",
                    county: "NORDLAND",
                    municipal: "BODØ",
                },
            ],
            contactList: [
                {
                    phone: "92455707",
                    name: "Karl-Inge Svendsgård",
                    title: "Daglig Leder",
                    email: "dagligleder@restaurantbjork.no",
                },
            ],
            categoryList: [
                {
                    code: "3434",
                    categoryType: "STYRK08",
                    name: "Sjefskokker",
                    description: null,
                    parentId: null,
                },
                {
                    code: "http://data.europa.eu/esco/occupation/01484951-15e6-4b88-a20f-1201868d36a0",
                    categoryType: "ESCO",
                    name: "Kjøkkensjef",
                    description: null,
                    parentId: null,
                },
                {
                    code: "41679",
                    categoryType: "JANZZ",
                    name: "Kjøkkensjef",
                    description: null,
                    parentId: null,
                },
            ],
            employer: {
                name: "RESTAURANTHUSET BODØ AS",
                orgnr: "993857734",
            },
            updated: "2025-06-01T00:10:22.068587+02:00",
            properties: {
                extent: "Heltid",
                under18: ["false"],
                education: ["Fagbrev"],
                applicationdue: "31.05.2025",
                jobtitle: "Kitchen Manager Head Chef",
                positioncount: "1",
                engagementtype: "Fast",
                employerdescription:
                    "<h3>Bjørk is an Italian-inspired restaurant, centrally located in Glasshuset in Bodø.</h3><p>When you visit us, you can follow the pizza chefs in action from morning to night, and we can offer a varied menu consisting of stone oven-baked pizza, homemade pasta, grilled dishes from our Josper charcoal grill, fresh salads, and sweet desserts. The dishes are carefully composed and largely consist of good local ingredients.</p><p>The restaurant has several sections including, a restaurant, outdoor seating, a bar, event rooms, and meeting facilities. Here you can enjoy a cozy and informal atmosphere that is just as suitable for everyday life as it is for slightly larger occasions.</p>",
                remote: "Hjemmekontor ikke mulig",
                experience: ["Mye"],
                adtext: '<p><strong>About the Job</strong></p><p>As our Head Chef, you will need to be both creative and highly organized. Curiosity and a passion for staying professionally up-to-date are essential. You will be a steady leader with strong values and leadership skills, setting a positive example for your team.</p><p>Your primary focus will be to ensure that all our guests have the best possible experience every time they visit us.</p><p>A passion for food and a commitment to high-quality work are crucial. A willingness to learn and grow will be central to your success.</p><p>As our Head Chef, you must thrive in a fast-paced environment and handle stressful situations without letting it affect you, your colleagues, or our guests.</p><p>Communication with both guests and colleagues is vital, so proficiency in either Norwegian, another Scandinavian language, or English is required.</p><p><strong>Our Ideal Head Chef Will Have:</strong></p><ul><li><p>A culinary certificate (Fagbrev)</p></li><li><p>At least five years of experience in the kitchen</p></li><li><p>Minimum two years as a Sous Chef or Head Chef</p></li><li><p>Knowledge of HACCP standards</p></li><li><p>Understanding of kitchen economics and cost calculations</p></li></ul><p><strong>Responsibilities Include:</strong></p><ul><li><p>Developing menus with cost calculations and recipes</p></li><li><p>Assisting with hiring within your department</p></li><li><p>Creating work schedules</p></li><li><p>Inventory management</p></li><li><p>Ensuring HACCP and food safety compliance</p></li><li><p>Placing orders and managing supplier relations</p></li><li><p>Organizing and maintaining an efficient kitchen</p></li><li><p>Creating exceptional food</p></li></ul><p><strong>What We Offer:</strong></p><ul><li><p>Be part of the largest culinary team in Bodø, specializing in food and beverage</p></li><li><p>Stable job with secure and predictable working conditions</p></li><li><p>Excellent opportunities for professional development, including management, finance, and general operational skills</p></li><li><p>Diverse and engaging work tasks</p></li><li><p>Skilled colleagues and dedicated owners, ensuring quick and efficient decision-making</p></li><li><p>Assistance with housing if needed</p></li><li><p>Competitive compensation and benefits</p></li></ul><p>Experience, passion, ambition, and high standards of quality are valued as key attributes for joining our professional team. </p><p>Social media</p><p>To see more of what we do from day to day visit our channels</p><p><a href="https://www.facebook.com/restaurantbjork/" rel="nofollow">Facebook</a></p><p><a href="https://www.instagram.com/restaurantbjork/" rel="nofollow">Instagram</a></p><p><a href="https://www.restaurantbjork.no/" rel="nofollow">Our Website</a></p><p><a href="www.favnservering.no" rel="nofollow">Our Restaurant Group</a></p>',
                needDriversLicense: ["false"],
                sourceurl: "https://job.mojob.io/19978/",
                workLanguage: ["Norsk", "Skandinavisk", "Engelsk"],
                searchtags: [
                    {
                        label: "Kjøkkensjef",
                        score: 1,
                    },
                    {
                        label: "Overkokk",
                        score: 0.8,
                    },
                    {
                        label: "Kjøkkenleder",
                        score: 0.8,
                    },
                ],
                applicationurl:
                    "https://job.mojob.io/19979/?utm_id=12145&utm_campaign=12145&utm_medium=job_share&utm_source=nav&utm_term=Kitchen+Manager+Head+Chef&utm_content=19979",
                sector: "Privat",
            },
            status: "STOPPED",
        },
    };

    try {
        const headers = await getDefaultHeaders();
        const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/${id}?_source_includes=${sourceIncludes}`, {
            headers: headers,
            next: { revalidate: 60 },
        });

        if (res.status === 404) {
            notFound();
        }

        if (!res.ok) {
            const errorMessage = `Hent stilling med id ${id} feilet, status: ${res.status}`;
            logger.error(errorMessage);
            return Promise.reject(errorMessage);
        }

        const json = a;

        const validatedData = transformElasticRawToAdData.safeParse(json);

        if (!validatedData.success) {
            logZodError(id, validatedData.error);

            return transformAdData(json._source, json._id, json._properties);
        }

        console.log("YOOOO", validatedData.data);

        return validatedData.data;
    } catch (error) {
        if (isNotFoundError(error)) {
            logger.info(`Stilling ikke funnet: ${id}`, error);
        } else {
            logger.error(`Stilling feilet: ${id}`, error);
        }

        throw error;
    }
}
