import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import FacebookIcon from './FacebookIcon';
import LinkedinIcon from './LinkedinIcon';
import TwitterIcon from './TwitterIcon';
import MessengerIcon from './MessengerIcon';
import { UAParser } from 'ua-parser-js';
import './SocialShare.less';

const deviceType = new UAParser().getResult().device.type;

export default function SocialShare({ title }) {
    return (
        <div className="share-section__body">
            <div>
                <Normaltekst className="label">Del annonsen:</Normaltekst>
            </div>
            <div className="facebook">
                <a
                    href={"https://www.facebook.com/sharer/sharer.php?u=" + location.href}
                    title="Del på Facebook"
                    aria-label="Del på Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FacebookIcon />
                </a>
            </div>
            <div className="linkedin">
                <a
                    href={"https://www.linkedin.com/shareArticle?mini=true&url=" + location.href}
                    title="Del på Linkedin"
                    aria-label="Del på Linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <LinkedinIcon />
                </a>
            </div>
            <div className="twitter">
                <a
                    href={"https://twitter.com/intent/tweet?url=" + location.href + "&text=" + encodeURI(title)}
                    title="Del på Twitter"
                    aria-label="Del på Twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <TwitterIcon />
                </a>
            </div>
            {(deviceType === "mobile" || deviceType === "tablet") && (
                <div className="messenger">
                    <a
                        href={"fb-messenger://share/?link=" + encodeURIComponent(location.href)}
                        title="Del i Messenger"
                        aria-label="Del i Messenger"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MessengerIcon />
                    </a>
                </div>
            )}
        </div>
    );
}
