import Home from "@/app/(forside)/_components/Home";

export const metadata = {
    title: "Arbeidsplassen.no - alt av arbeid, samlet på én plass",
    description:
        "Finn din neste jobb i en av Norges største samlinger av stillinger. Her finner du jobber fra alle bransjer i markedet.",
    verification: {
        google: "I1DCqGuh-OEl_WXTcLI7NaNdS4-MjGo9nS_g2OQoajo",
    },
};

export default function Page() {
    return <Home />;
}
