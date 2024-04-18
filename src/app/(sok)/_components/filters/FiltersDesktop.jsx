import { Accordion, Button } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import Remote from '@/app/(sok)/_components/filters/Remote';
import ShareYourOpinionPanel from '@/app/tilbakemelding-nye-filtre/_components/ShareYourOpinionPanel';

import EngagementType from './Engagement';
import Extent from './Extent';
import FilterAccordionItem from './FilterAccordionItem';
import Counties from './Locations';
import Occupations from './Occupations';
import Published from './Published';
import Sector from './Sector';
import WorkLanguage from './WorkLanguage';

function FiltersDesktop({
  query, dispatchQuery, aggregations, locations, searchResult,
}) {
  return <div>
    <ShareYourOpinionPanel />
    <Accordion headingSize="small" indent={false}>
      <FilterAccordionItem panelId="publisert" title="Publisert">
        <Published
          dispatch={dispatchQuery}
          initialValues={aggregations.published}
          query={query}
          updatedValues={searchResult.aggregations.published}
        />
      </FilterAccordionItem>
      <FilterAccordionItem panelId="sted" title="Sted">
        <Counties
          dispatch={dispatchQuery}
          locations={locations}
          query={query}
          updatedValues={searchResult}
        />
      </FilterAccordionItem>
      <FilterAccordionItem panelId="hjemmekontor" title="Hjemmekontor">
        <Remote
          dispatch={dispatchQuery}
          initialValues={aggregations.remote}
          query={query}
          updatedValues={searchResult.aggregations.remote}
        />
      </FilterAccordionItem>
      <FilterAccordionItem panelId="yrke" title="Yrke">
        <Occupations
          dispatch={dispatchQuery}
          initialValues={aggregations.occupationFirstLevels}
          query={query}
          updatedValues={searchResult.aggregations.occupationFirstLevels}
        />
      </FilterAccordionItem>
      <FilterAccordionItem panelId="extent" title="Heltid/deltid">
        <Extent
          dispatch={dispatchQuery}
          initialValues={aggregations.extent}
          query={query}
          updatedValues={searchResult.aggregations.extent}
        />
      </FilterAccordionItem>
      <FilterAccordionItem panelId="sector" title="Sektor">
        <Sector
          dispatch={dispatchQuery}
          initialValues={aggregations.sector}
          query={query}
          updatedValues={searchResult.aggregations.sector}
        />
      </FilterAccordionItem>
      <FilterAccordionItem panelId="engagementType" title="Ansettelsesform">
        <EngagementType
          dispatch={dispatchQuery}
          initialValues={aggregations.engagementTypes}
          query={query}
          updatedValues={searchResult.aggregations.engagementTypes}
        />
      </FilterAccordionItem>
      <FilterAccordionItem panelId="workLanguage" title="Arbeidsspråk">
        <WorkLanguage
          dispatch={dispatchQuery}
          initialValues={aggregations.workLanguage}
          query={query}
          updatedValues={searchResult.aggregations.workLanguage}
        />
      </FilterAccordionItem>
    </Accordion>
    <noscript>
      <Button type="submit">Søk</Button>
    </noscript>
  </div>
}

FiltersDesktop.propTypes = {
  query: PropTypes.shape({}),
  dispatchQuery: PropTypes.func,
  locations: PropTypes.arrayOf(PropTypes.shape({})),
  aggregations: PropTypes.shape({
    engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
    occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
    published: PropTypes.arrayOf(PropTypes.shape({})),
    extent: PropTypes.arrayOf(PropTypes.shape({})),
    sector: PropTypes.arrayOf(PropTypes.shape({})),
    workLanguage: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  searchResult: PropTypes.shape({
    aggregations: PropTypes.shape({
      engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
      occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
      published: PropTypes.arrayOf(PropTypes.shape({})),
      extent: PropTypes.arrayOf(PropTypes.shape({})),
      sector: PropTypes.arrayOf(PropTypes.shape({})),
      workLanguage: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }),
};

export default FiltersDesktop;
