import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { formatISOString, isValidISOString } from '../utils';
import ReactHtmlParser from 'react-html-parser';

export const tilpassLenke = (lenke) => {
    if(lenke.includes('@')) {
        return 'mailto:' + lenke;
    } else if(!lenke.startsWith('http')) {
        return 'https://' + lenke
    } else {
        return lenke;
    }
};

export const tilpassTwitterAdresse = (adresse) => {
    if(adresse.startsWith('@')) {
        return 'https://twitter.com/'+ adresse;
    } else if(!adresse.startsWith('http')) {
        return 'https://' + adresse
    } else {
        return adresse;
    }
};

export default function Details({ stilling }) {
    const { _source } = stilling;
    const { properties } = _source;
    const sokUrl = properties.applicationurl !== undefined ? properties.applicationurl : properties.sourceurl;
    return (
        <div id="detail-sidebar">
            <div className="detail-section">
                <Undertittel id="tilleggsinformasjon-title" className="blokk-s">Tilleggsinformasjon</Undertittel>
                <Element tag="h3" className="detail-section__head">Om stillingen</Element>
                <dl className="dl-flex typo-normal">
                    {properties.jobtitle && [
                        <dt key="dt">Stillingstittel:</dt>,
                        <dd key="dd">{properties.jobtitle}</dd>]
                    }
                    {properties.location && [
                        <dt key="dt">Sted:</dt>,
                        <dd key="dd">{properties.location}</dd>
                    ]}
                    {properties.engagementtype  && [
                        <dt key="dt">Ansettelsesform:</dt>,
                        <dd key="dd">{properties.engagementtype }</dd>
                    ]}
                    {properties.extent && [
                        <dt key="dt">Heltid/deltid:</dt>,
                        <dd key="dd">{properties.extent}</dd>
                    ]}
                    {properties.positioncount && [
                        <dt key="dt">Antall stillinger:</dt>,
                        <dd key="dd">{properties.positioncount}</dd>
                    ]}
                    {properties.sector && [
                        <dt key="dt">Sektor:</dt>,
                        <dd key="dd">{properties.sector}</dd>
                    ]}
                    {properties.workday && [
                        <dt key="dt">Arbeidsdager:</dt>,
                        <dd key="dd">{properties.workday}</dd>
                    ]}
                    {properties.workhours && [
                        <dt key="dt">Arbeidstid:</dt>,
                        <dd key="dd">{properties.workhours}</dd>
                    ]}
                    {properties.jobarrangement && [
                        <dt key="dt">Arb.tidsordning:</dt>,
                        <dd key="dd">{properties.jobarrangement}</dd>
                    ]}
                    {properties.starttime && [
                        <dt key="dt">Oppstart:</dt>,
                        <dd key="dd">
                            {isValidISOString(properties.starttime) ? formatISOString(properties.starttime, 'D. MMMM YYYY') : properties.starttime}
                        </dd>
                    ]}
                </dl>
            </div>

            {(properties.applicationdue || properties.applicationemail || sokUrl) && (
                <div className="detail-section">
                    <Element tag="h3" className="detail-section__head">Søknad</Element>
                    <dl className="dl-flex typo-normal">
                        {properties.applicationdue && [
                            <dt key="dt">Søknadsfrist:</dt>,
                            <dd key="dd">
                                {isValidISOString(properties.applicationdue) ?
                                    formatISOString(properties.applicationdue, 'D. MMMM YYYY') :
                                    properties.applicationdue}
                            </dd>
                        ]}
                        {properties.applicationemail && [
                            <dt key="dt">Send søknad til:</dt>,
                            <dd key="dd">
                                <a
                                    className="lenke"
                                    href={tilpassLenke(properties.applicationemail)}
                                >
                                    {properties.applicationemail}
                                </a>
                            </dd>
                        ]}
                    </dl>

                    {sokUrl && (
                        <div id="send-soknad-wrapper">
                            <a
                                id="send-soknad"
                                className="knapp knapp--hoved hovedknapp--green"
                                href={sokUrl}
                            >
                            Send søknad
                            </a>
                        </div>
                    )}
                </div>
            )}

            {(properties.contactperson || properties.contactpersontitle || properties.contactpersonphone || properties.contactpersonemail) && (
                <div className="detail-section light-green-bg">
                    <Element tag="h3" className="detail-section__head">Kontaktperson for stillingen</Element>
                    <dl className="dl-flex typo-normal">
                        {properties.contactperson && [
                            <dt key="dt">Kontaktperson:</dt>,
                            <dd key="dd">{properties.contactperson}</dd>
                        ]}
                        {properties.contactpersontitle && [
                            <dt key="dt">Stillingstittel:</dt>,
                            <dd key="dd">{properties.contactpersontitle}</dd>
                        ]}
                        {properties.contactpersonphone && [
                            <dt key="dt">Telefon:</dt>,
                            <dd key="dd">{properties.contactpersonphone}</dd>
                        ]}
                        {properties.contactpersonemail && [
                            <dt key="dt">Epost:</dt>,
                            <dd key="dd">
                                <a
                                    href={tilpassLenke(properties.contactpersonemail)}
                                    className="lenke"
                                >
                                    {properties.contactpersonemail}
                                </a>
                            </dd>
                        ]}
                    </dl>
                </div>
            )}


            <div className="detail-section">
                <Element tag="h3" className="detail-section__head">Om bedriften</Element>
                <dl className="dl-flex typo-normal">
                    {properties.employer && [
                        <dt key="dt">Arbeidsgiver:</dt>,
                        <dd key="dd">{properties.employer}</dd>
                    ]}
                    {properties.address && [
                        <dt key="dt">Adresse:</dt>,
                        <dd key="dd">{properties.address}</dd>
                    ]}
                    {properties.employerhomepage && [
                        <dt key="dt">Hjemmeside:</dt>,
                        <dd key="dd">
                            <a
                                href={tilpassLenke(properties.employerhomepage)}
                                className="lenke"
                            >
                                {properties.employerhomepage}
                            </a>
                        </dd>
                    ]}
                    {properties.linkedinpage && [
                        <dt key="dt">LinkedIn:</dt>,
                        <dd key="dd">
                            <a
                                href={tilpassLenke(properties.linkedinpage)}
                                className="lenke"
                            >
                                {properties.linkedinpage}
                            </a>
                        </dd>
                    ]}
                    {properties.twitteraddress && [
                        <dt key="dt">Twitter:</dt>,
                        <dd key="dd">
                            <a
                                href={tilpassTwitterAdresse(properties.twitteraddress)}
                                className="lenke"
                            >
                                {properties.twitteraddress}
                            </a>
                        </dd>
                    ]}
                    {properties.facebookpage && [
                        <dt key="dt">Facebook:</dt>,
                        <dd key="dd">
                            <a
                                href={tilpassLenke(properties.facebookpage)}
                                className="lenke"
                            >
                                {properties.facebookpage}
                            </a>
                        </dd>
                    ]}
                </dl>
                {properties.employerdescription && (
                    <div id="employerdescription">{ ReactHtmlParser(properties.employerdescription) }</div>
                )}
            </div>


            <div className="detail-section">
                <Element tag="h3" className="detail-section__head">Om annonsen</Element>
                <dl className="dl-flex typo-normal">
                    {_source.updated && [
                        <dt key="dt">Sist endret:</dt>,
                        <dd key="dd">{formatISOString(_source.updated, 'D. MMMM YYYY')}</dd>
                    ]}
                    {_source.source && [
                        <dt key="dt">Hentet fra:</dt>,
                        <dd key="dd">{_source.source}</dd>
                    ]}
                    {_source.reference && [
                        <dt key="dt">ID nr.:</dt>,
                        <dd key="dd">{_source.reference}</dd>
                    ]}
                </dl>
            </div>
        </div>
    );
}

