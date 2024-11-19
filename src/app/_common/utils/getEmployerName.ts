import { StillingDetaljer } from "@/app/lib/stillingSchema";
import { StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

function getEmployerName(stilling: StillingSoekElement | StillingDetaljer) {
    if (stilling && stilling.employer && typeof stilling.employer === "object" && "name" in stilling.employer) {
        return stilling.employer.name;
    }
    if (typeof stilling.employer === "string") {
        return stilling.employer;
    }
    return null;
}
export default getEmployerName;
