import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { GetRequestCallId } from "@/app/stillinger/_common/monitoring/getRequestCallId";

export type CallId = string;
export function resolveCallId(input: string | null | undefined): GetRequestCallId {
    return input && uuidValidate(input) ? input : uuidv4();
}
