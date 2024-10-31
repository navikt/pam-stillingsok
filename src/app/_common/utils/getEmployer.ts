import { AdDTORAWSchema, MappedAdDTO } from "@/app/lib/stillingSoekSchema.ts";

function getEmployer(stilling: AdDTORAWSchema | MappedAdDTO) {
    // Dersom properties finnes er typen AdDTORAWSchema
    if (stilling && "properties" in stilling && stilling.properties && stilling.properties.employer) {
        return stilling.properties.employer;
    }
    if (stilling && stilling.businessName) {
        return stilling.businessName;
    }
    if (stilling && stilling.employer) {
        return stilling.employer.name;
    }

    return null;
}
export default getEmployer;
