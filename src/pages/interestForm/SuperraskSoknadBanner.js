import React from "react";
import "./SuperraskSoknadBanner.less";

function SuperraskSoknadBanner() {
    return (
        <section className="SuperraskSoknadBanner">
            <h3 className="Search__h2">Nyhet! Superrask søknad</h3>
            <p>
                Vis frem deg selv og din erfaring enkelt og raskt når du søker på stillinger med superrask søknad.
            </p>
            <p>
                <a href="/slik-fungerer-superrask-soknad" className="link">Hvordan fungerer superrask søknad?</a>
            </p>
        </section>
    );
}


export default SuperraskSoknadBanner;
