import type { Paragraph } from "@/app/innholdsmodul-demo/_data/types";
import AccordionModule from "./modules/AccordionModule";
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
                    case "paragraph--accordion":
                        return <AccordionModule key={paragraph.id} paragraph={paragraph} />;
                }
            })}
        </>
    );
}
