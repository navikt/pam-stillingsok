import * as React from 'react';
import './Personbrukermeny.less';
import {NavLink} from 'react-router-dom';

const tabs = [
    {
        tittel: 'Min side',
        href: '/minside',
        app: 'CV'
    },
    {
        tittel: 'Ledige stillinger',
        href: '/stillinger',
        app: 'STILLINGSSOK'
    },
    {
        tittel: 'Favoritter',
        href: '/stillinger/favoritter',
        app: 'STILLINGSSOK'
    },
    {
        tittel: 'Lagrede søk',
        href: '/stillinger/lagrede-sok',
        app: 'STILLINGSSOK'
    },
    {
        tittel: 'Min CV',
        href: '/cv',
        app: 'CV'
    },
    {
        tittel: 'Jobbtreff',
        href: '/moteplass/arrangement',
        app: 'MOTEPLASS'
    }
];

const stillingssokTabActive = (match, location) => {
    if (!match) {
        return false;
    }
    return location.pathname === '/stillinger' || location.pathname.match(/\/stillinger\/stilling*/);
};

export const InnstillingerLenkeMobil = ({
    applikasjon,
    onNavigationClick
}) => (
    <div role="list" className="Personbrukermeny--lenke-wrapper Personbrukermeny__Innstillinger--mobile">
        {applikasjon === 'CV' ? (
            <NavLink
                to="/personinnstillinger"
                onClick={onNavigationClick("/personinnstillinger")}
                activeClassName="Personbrukermeny--lenke-active"
                className="Personbrukermeny--lenke"
            >
                <div className="Personbrukermeny--lenke-inner"><span>Innstillinger</span></div>
            </NavLink>
        ) : (
            <a
                href="/personinnstillinger"
                onClick={onNavigationClick("/personinnstillinger")}
                className="Personbrukermeny--lenke"
            >
                <div className="Personbrukermeny--lenke-inner"><span>Innstillinger</span></div>
            </a>
        )}
    </div>
);


export const Personbrukermeny = ({ applikasjon, onNavigationClick }) => {
    const cvUris = ['/cv'];

    return (
        <nav role="list" className="Personbrukermeny">
            {tabs.map((tab) => (
                applikasjon === tab.app ? (
                    tab.href === '/stillinger' ? (
                        <div className="Personbrukermeny--lenke-wrapper" key={tab.href}>
                            <NavLink
                                to={tab.href}
                                onClick={onNavigationClick(tab.href)}
                                isActive={stillingssokTabActive}
                                activeClassName="Personbrukermeny--lenke-active"
                                className="Personbrukermeny--lenke"
                            >
                                <div className="Personbrukermeny--lenke-inner"><span>{tab.tittel}</span></div>
                            </NavLink>
                        </div>
                    ) : (
                        <div
                            className={cvUris.includes(tab.href) ? 'Personbrukermeny--lenke-wrapper-CV' : 'Personbrukermeny--lenke-wrapper'}
                            key={tab.href}>
                            <NavLink
                                to={tab.href}
                                onClick={onNavigationClick(tab.href)}
                                activeClassName="Personbrukermeny--lenke-active"
                                className="Personbrukermeny--lenke"
                            >
                                <div className="Personbrukermeny--lenke-inner"><span>{tab.tittel}</span></div>
                            </NavLink>
                        </div>
                    )
                ) : (
                    <div
                        className={cvUris.includes(tab.href) ? 'Personbrukermeny--lenke-wrapper-CV' : 'Personbrukermeny--lenke-wrapper'}
                        key={tab.href}>
                        <a
                            href={tab.href}
                            onClick={onNavigationClick(tab.href)}
                            className="Personbrukermeny--lenke"
                        >
                            <div className="Personbrukermeny--lenke-inner"><span>{tab.tittel}</span></div>
                        </a>
                    </div>
                )
            ))}
            <InnstillingerLenkeMobil applikasjon={applikasjon} onNavigationClick={onNavigationClick}/>
        </nav>
    );
}
