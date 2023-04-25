import React from "react";
import "./NotFound404.css";
import PropTypes from "prop-types";
import { BodyLong, Heading } from "@navikt/ds-react";

function NotFound404({ title, text }) {
    return (
        <div className="NotFound404">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="NotFound404-blue-guy"
            role="img"
            aria-label="En blå figur"
            width="157" 
            height="182" 
            viewBox="0 0 157 182" 
            fill="none">
                <path d="M155.928 161.678C153.565 180.671 94.9789 181.086 80.4458 181.086C65.9126 181.086 -2.94688 182.778 0.101582 166.714C3.15004 150.649 56.3753 140.05 80.4458 149.998C104.516 159.947 158.291 142.685 155.928 161.678Z" fill="#DFE2F3"/>
                <path d="M59.9813 122.657C61.6585 139.774 61.6312 148.515 59.9813 162.592" stroke="#024B62" stroke-width="2" stroke-linecap="round"/>
                <path d="M88.327 122.657C86.6498 139.774 86.6771 148.515 88.327 162.592" stroke="#024B62" stroke-width="2" stroke-linecap="round"/>
                <path d="M126.854 66.3206C124.606 108.955 101.565 132.641 72.9033 132.641C44.242 132.641 22.3246 97.1124 18.9527 66.3206C15.5808 35.5289 38.1412 0 72.9033 0C107.665 0 129.102 23.6859 126.854 66.3206Z" fill="url(#paint0_linear_1106_13559)"/>
                <g clip-path="url(#clip0_1106_13559)">
                <ellipse cx="58.6945" cy="44.7124" rx="8.69703" ry="13.3354" fill="white"/>
                <ellipse cx="58.6945" cy="50.8672" rx="4.60431" ry="7.18062" fill="#024B62"/>
                <ellipse cx="88.3667" cy="44.7124" rx="8.69703" ry="13.3354" fill="white"/>
                <ellipse cx="88.3666" cy="50.8672" rx="4.60431" ry="7.18062" fill="#024B62"/>
                </g>
                <path d="M93.8742 163.071C91.8838 162.748 89.4732 161.934 87.478 162.211C86.1148 162.4 84.7115 162.495 83.33 162.271" stroke="#024B62" stroke-width="3" stroke-linecap="round"/>
                <path d="M53.7538 161.632C57.2236 161.632 60.5896 162.08 64.0661 162.08" stroke="#024B62" stroke-width="3" stroke-linecap="round"/>
                <path d="M20.6459 80.2942L21.6103 80.0298L21.0815 78.1009L20.1171 78.3653L20.6459 80.2942ZM62.7813 71.8156C63.2317 71.4961 63.3378 70.8719 63.0183 70.4214C62.6987 69.971 62.0745 69.8649 61.6241 70.1844L62.7813 71.8156ZM57.2352 68.3464C57.7027 68.0523 57.8432 67.435 57.5491 66.9675C57.255 66.5 56.6377 66.3595 56.1702 66.6536L57.2352 68.3464ZM61.4081 67.2087C61.7996 66.8191 61.801 66.186 61.4114 65.7945C61.0218 65.4031 60.3886 65.4016 59.9972 65.7913L61.4081 67.2087ZM20.1171 78.3653C17.4968 79.0837 15.5863 79.8431 14.344 80.6102C13.7257 80.9919 13.2132 81.4115 12.8728 81.8813C12.5218 82.3656 12.312 82.971 12.4738 83.6212C12.6279 84.2406 13.0675 84.6837 13.5313 84.989C14.0018 85.2986 14.5957 85.5341 15.2592 85.7132C16.5906 86.0727 18.387 86.2537 20.5224 86.2272C29.0669 86.1214 43.8075 82.68 58.4679 72.3166L57.3135 70.6834C42.9739 80.82 28.6252 84.1267 20.4976 84.2274C18.4651 84.2526 16.8695 84.0763 15.7805 83.7824C15.2338 83.6348 14.8604 83.4695 14.6309 83.3184C14.3947 83.1629 14.4015 83.0854 14.4146 83.1382C14.4355 83.2219 14.3764 83.2148 14.4923 83.0549C14.6188 82.8804 14.8894 82.6239 15.3947 82.3119C16.3997 81.6914 18.0988 80.9924 20.6459 80.2942L20.1171 78.3653ZM57.8868 72.5C58.2305 72.5013 58.5372 72.5418 58.8638 72.5934C59.1699 72.6418 59.5571 72.7126 59.9433 72.7337C60.8254 72.7821 61.7029 72.5806 62.7813 71.8156L61.6241 70.1844C60.8878 70.7067 60.4517 70.7586 60.0527 70.7367C59.7982 70.7228 59.553 70.6776 59.1762 70.618C58.8199 70.5616 58.3933 70.502 57.8947 70.5L57.8868 72.5ZM58.2797 70.5787C58.1369 70.5184 57.8851 70.3647 57.6125 70.1233C57.3445 69.8858 57.1114 69.612 56.9656 69.3487C56.8172 69.0807 56.8014 68.9041 56.8191 68.8067C56.831 68.7411 56.8806 68.5695 57.2352 68.3464L56.1702 66.6536C55.4564 67.1026 54.9855 67.7101 54.8512 68.4494C54.7228 69.1568 54.9353 69.8107 55.216 70.3177C55.4995 70.8295 55.8967 71.2752 56.2864 71.6204C56.6716 71.9616 57.1051 72.2537 57.5017 72.4212L58.2797 70.5787ZM57.8907 71.5C58.8907 71.4894 58.8907 71.49 58.8907 71.4907C58.8907 71.4909 58.8907 71.4915 58.8907 71.4919C58.8907 71.4927 58.8907 71.4934 58.8907 71.4942C58.8907 71.4956 58.8907 71.4969 58.8907 71.4981C58.8907 71.5005 58.8907 71.5024 58.8907 71.5038C58.8907 71.5066 58.8906 71.5074 58.8907 71.5063C58.8907 71.5039 58.8911 71.4937 58.8924 71.4761C58.8951 71.4408 58.9016 71.3754 58.9173 71.2829C58.9487 71.0981 59.0169 70.8032 59.1657 70.4204C59.4618 69.6583 60.0856 68.5252 61.4081 67.2087L59.9972 65.7913C58.4847 67.2967 57.7026 68.6636 57.3014 69.6961C57.1016 70.2105 56.9984 70.6365 56.9455 70.9483C56.9191 71.104 56.9052 71.2309 56.8981 71.3257C56.8945 71.3731 56.8926 71.4125 56.8916 71.4434C56.8912 71.4589 56.8909 71.4723 56.8908 71.4835C56.8907 71.4891 56.8907 71.4941 56.8907 71.4987C56.8907 71.5009 56.8907 71.503 56.8907 71.505C56.8907 71.506 56.8907 71.507 56.8907 71.5079C56.8907 71.5084 56.8908 71.509 56.8908 71.5093C56.8908 71.5099 56.8908 71.5106 57.8907 71.5Z" fill="#024B62"/>
                <path d="M49.7015 29.8954C55.5801 22.3101 60.6231 21.5563 63.434 26.2083" stroke="#024B62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M97.9122 30.2216C92.7069 27.1549 88.2848 26.1827 83.7012 27.716" stroke="#024B62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M64.7028 64.5216C66.1313 63.5647 72.5599 64.0431 79.7028 65" stroke="#024B62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M126.937 76.0071L125.946 75.8687L125.669 77.8494L126.66 77.9878L126.937 76.0071ZM114.519 36.0513C113.995 35.8767 113.429 36.1598 113.254 36.6838C113.079 37.2077 113.363 37.774 113.887 37.9487L114.519 36.0513ZM114.352 38.5112C113.806 38.4287 113.297 38.8044 113.214 39.3505C113.131 39.8966 113.507 40.4062 114.053 40.4888L114.352 38.5112ZM115.867 31.7869C115.323 31.6961 114.807 32.0641 114.716 32.6089C114.626 33.1536 114.994 33.6689 115.538 33.7596L115.867 31.7869ZM126.66 77.9878C129.032 78.3194 131.009 78.0797 132.579 77.282C134.166 76.4758 135.232 75.1531 135.863 73.5292C137.095 70.3548 136.699 65.958 135.427 61.4498C134.142 56.8956 131.909 52.0362 129.236 47.8218C126.573 43.6231 123.418 39.9758 120.244 37.9325L119.162 39.614C121.988 41.4341 124.957 44.8093 127.547 48.893C130.128 52.9611 132.275 57.644 133.502 61.9929C134.742 66.3876 134.989 70.2546 133.998 72.8052C133.517 74.044 132.755 74.9492 131.673 75.4989C130.574 76.057 129.041 76.3012 126.937 76.0071L126.66 77.9878ZM119.703 38.7733C119.999 37.8179 119.999 37.8179 119.999 37.8179C119.998 37.8179 119.998 37.8179 119.998 37.8179C119.998 37.8179 119.998 37.8178 119.998 37.8178C119.998 37.8177 119.997 37.8176 119.997 37.8174C119.996 37.817 119.994 37.8165 119.992 37.8158C119.987 37.8143 119.98 37.8121 119.97 37.8092C119.952 37.8034 119.924 37.7947 119.887 37.7832C119.813 37.7603 119.704 37.7264 119.564 37.6825C119.284 37.5948 118.88 37.4674 118.381 37.3087C117.384 36.9914 116.014 36.5495 114.519 36.0513L113.887 37.9487C115.392 38.4505 116.772 38.8952 117.775 39.2145C118.276 39.3742 118.684 39.5026 118.967 39.5911C119.108 39.6353 119.218 39.6696 119.293 39.6929C119.33 39.7046 119.359 39.7134 119.378 39.7194C119.388 39.7224 119.395 39.7247 119.4 39.7262C119.402 39.727 119.404 39.7276 119.406 39.728C119.406 39.7282 119.407 39.7283 119.407 39.7284C119.407 39.7285 119.407 39.7285 119.407 39.7286C119.407 39.7286 119.408 39.7286 119.408 39.7286C119.408 39.7286 119.408 39.7286 119.703 38.7733ZM119.424 37.813C116.958 38.5297 115.631 38.7045 114.352 38.5112L114.053 40.4888C115.775 40.749 117.447 40.4703 119.982 39.7335L119.424 37.813ZM120.703 38.7731C120.703 37.2846 120.437 35.7182 119.696 34.4236C118.932 33.0902 117.683 32.0895 115.867 31.7869L115.538 33.7596C116.723 33.9571 117.474 34.5696 117.96 35.4179C118.468 36.305 118.703 37.4886 118.703 38.7734L120.703 38.7731Z" fill="#024B62"/>
                <defs>
                    <linearGradient id="paint0_linear_1106_13559" x1="72.8175" y1="0" x2="72.8175" y2="132.641" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#9CA8F5"/>
                        <stop offset="1" stop-color="#717DC7"/>
                    </linearGradient>
                    <clipPath id="clip0_1106_13559">
                        <rect width="47.0663" height="26.6709" fill="white" transform="translate(49.9974 31.377)"/>
                    </clipPath>
                </defs>
            </svg>  
            
            <Heading level="1" size="large" spacing>
                {title}
            </Heading>
            <BodyLong>{text}</BodyLong>
        </div>
    );
}

NotFound404.defaultProps = {
    title: "Vi fant dessverre ikke innholdet du ser etter",
    text: "Det kan være en feil i lenken du brukte."
};

NotFound404.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string
};

export default NotFound404;
