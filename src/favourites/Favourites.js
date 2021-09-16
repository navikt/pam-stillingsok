import { Column, Container, Row } from 'nav-frontend-grid';
import React, { useContext, useState } from 'react';
import PageHeader from '../common/components/PageHeader';
import DelayedSpinner from '../common/components/DelayedSpinner';
import RestoreScroll from '../common/components/RestoreScroll';
import FavouriteList from './list/FavouriteList';
import { CONTEXT_PATH } from '../fasitProperties';
import Sorting from './sorting/Sorting';
import { useDocumentTitle, useScrollToTop, useTrackPageview } from '../common/hooks';
import { Link } from 'react-router-dom';
import './Favourites.less';
import { FavouritesContext } from './FavouritesProvider';

export default function Favourites() {
    const { favourites, isFetching, sortBy, setSortBy } = useContext(FavouritesContext);

    useDocumentTitle('Favoritter - Arbeidsplassen');

    useScrollToTop();

    return (
        <RestoreScroll id="Favourites">
            <a id="main-content" tabIndex="-1"/>
            <div className="Favourites">
                <PageHeader
                    title="Favoritter"
                />
                <Container className="Favourites__main">
                    {isFetching || !favourites ? (
                        <Row>
                            <Column xs="12">
                                <div className="Favourites__main__spinner">
                                    <DelayedSpinner/>
                                </div>
                            </Column>
                        </Row>
                    ) : (
                        <Row>
                            <Column xs="12">
                                {favourites.length > 0 ? (
                                    <React.Fragment>
                                        <div className="Favourites__main__total-and-sorting">
                                            <h2 className="Favourites__count">
                                                {favourites.length !== 1 ? `${favourites.length} annonser` : '1 annonse'}
                                            </h2>
                                            <Sorting sortBy={sortBy} onSortByChange={setSortBy}/>
                                        </div>
                                        <FavouriteList favourites={favourites}/>
                                    </React.Fragment>
                                ) : (
                                    <div className="Favourites__ingen-favoritter">
                                        <h2 className="Favourites__ingen-favoritter-title">
                                            Her vil du se dine favoritter
                                        </h2>
                                        <p className="Favourites__ingen-favoritter-text">
                                            Klikk på stjernen når du ser en stilling du ønsker å ta vare på.
                                        </p>
                                        <Link to={CONTEXT_PATH} className="link">
                                            Vis ledige stillinger
                                        </Link>
                                    </div>
                                )}
                            </Column>
                        </Row>
                    )}
                </Container>
            </div>
        </RestoreScroll>
    );
};
