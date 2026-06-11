import type { KomplettParagraph } from "@/app/innholdsmodul-demo/_data/speculativeTypes";
import AccordionModule from "./modules/AccordionModule";
import BannerModule from "./modules/BannerModule";
import CtaGridModule from "./modules/CtaGridModule";
import CtaModule from "./modules/CtaModule";
import HtmlModule from "./modules/HtmlModule";
import NoticeBlockModule from "./modules/NoticeBlockModule";
import QuizModule from "./modules/QuizModule";
import SituationsCardsModule from "./modules/SituationsCardsModule";
import SpacerModule from "./modules/SpacerModule";
import TipHeadingModule from "./modules/TipHeadingModule";
import TitleTextImageModule from "./modules/TitleTextImageModule";

type Props = {
    paragraphs: KomplettParagraph[];
};

export default function KomplettRenderer({ paragraphs }: Props) {
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
                    case "paragraph--cta":
                        return <CtaModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--cta_grid":
                        return <CtaGridModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--banner":
                        return <BannerModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--notice_block":
                        return <NoticeBlockModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--situations_cards":
                        return <SituationsCardsModule key={paragraph.id} paragraph={paragraph} />;
                    case "paragraph--quiz":
                        return <QuizModule key={paragraph.id} paragraph={paragraph} />;
                }
            })}
        </>
    );
}
