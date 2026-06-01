import type { Paragraph } from "@/app/innholdsmodul-demo/_data/types";
import AccordionModule from "./modules/AccordionModule";
import CtaGridModule from "./modules/CtaGridModule";
import CtaModule from "./modules/CtaModule";
import HtmlModule from "./modules/HtmlModule";
import SpacerModule from "./modules/SpacerModule";
import TipHeadingModule from "./modules/TipHeadingModule";
import TitleTextImageModule from "./modules/TitleTextImageModule";

type Props = {
    paragraphs: Paragraph[];
};

export default function InnholdsmodulRenderer({ paragraphs }: Props) {
    return (
        <>
            {paragraphs.map((paragraph) => {
                switch (paragraph.type) {
                    case "paragraph--tip_heading":
                        return <TipHeadingModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--lpp_html":
                        return <HtmlModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--lpp_spacer":
                        return <SpacerModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--title_text_image":
                        return <TitleTextImageModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--lpp_accordion":
                        return <AccordionModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--lpp_cta":
                        return <CtaModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--lpp_cta_grid":
                        return <CtaGridModule key={paragraph.id} paragraph={paragraph} />;
                }
            })}
        </>
    );
}
