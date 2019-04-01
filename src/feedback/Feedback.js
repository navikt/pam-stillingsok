import React from 'react';
import './Feedback.less';

export default function Feedback() {
    return (
        <div className="Feedback">
            <a
                className="Feedback__link"
                href="https://surveys.hotjar.com/s?siteId=118350&surveyId=124493"
            >
                <span className="Feedback__link__inner">
                    Gi tilbakemelding
                </span>
            </a>
        </div>
    );
}
