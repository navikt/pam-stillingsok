import { useRouter as nextUseRouter } from "next/navigation";
import { useHistory } from "react-router";

export default function useRouter() {
    if (process.env.NEXT_PUBLIC_IS_NEXT === "yes") {
        return nextUseRouter();
    }
    return useHistory();
}
