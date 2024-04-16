import {
  Button, Heading, Modal, Tabs,
} from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';

import Remote from '@/app/(sok)/_components/filters/Remote';
import { formatNumber } from '@/app/_common/utils/utils';
import ShareYourOpinionPanel from '@/app/tilbakemelding-nye-filtre/_components/ShareYourOpinionPanel';

import EngagementType from './Engagement';
import Extent from './Extent';
import Counties from './Locations';
import Occupations from './Occupations';
import Published from './Published';
import Sector from './Sector';
import WorkLanguage from './WorkLanguage';

const FiltersMobile = ({
  onCloseClick, searchResult, query, dispatchQuery, aggregations, locations,
}) => (
  <Modal open className="filter-modal" header={{ heading: 'Filtre' }} width="100%" onClose={onCloseClick}>
    <Modal.Body>
      <Tabs defaultValue="sted">
        <Tabs.List>
          <Tabs.Tab label="Sted" value="sted" />
          <Tabs.Tab label="Yrke" value="yrke" />
          <Tabs.Tab label="Andre filtre" value="andre" />
        </Tabs.List>
        <Tabs.Panel className="mt-8" value="sted">
          <Counties
            dispatch={dispatchQuery}
            locations={locations}
            query={query}
            updatedValues={searchResult}
          />
        </Tabs.Panel>
        <Tabs.Panel className="mt-8" value="yrke">
          <Occupations
            dispatch={dispatchQuery}
            initialValues={aggregations.occupationFirstLevels}
            query={query}
            updatedValues={searchResult ? searchResult.aggregations.occupationFirstLevels : null}
          />
        </Tabs.Panel>
        <Tabs.Panel className="mt-8" value="andre">
          <ShareYourOpinionPanel />
          <div className="mb-6">
            <Published
              dispatch={dispatchQuery}
              initialValues={aggregations.published}
              query={query}
              updatedValues={searchResult ? searchResult.aggregations.published : null}
            />
          </div>
          <div className="mb-6">
            <Heading level="2" size="small">
              Hjemmekontor
            </Heading>
            <Remote
              dispatch={dispatchQuery}
              initialValues={aggregations.remote}
              query={query}
              updatedValues={searchResult.aggregations.remote}
            />
          </div>
          <div className="mb-6">
            <Heading level="2" size="small">
              Heltid/deltid
            </Heading>
            <Extent
              dispatch={dispatchQuery}
              initialValues={aggregations.extent}
              query={query}
              updatedValues={searchResult ? searchResult.aggregations.extent : null}
            />
          </div>
          <div className="mb-6">
            <Heading level="2" size="small">
              Sektor
            </Heading>
            <Sector
              dispatch={dispatchQuery}
              initialValues={aggregations.sector}
              query={query}
              updatedValues={searchResult ? searchResult.aggregations.sector : null}
            />
          </div>
          <div className="mb-6">
            <Heading level="2" size="small">
              Ansettelsesform
            </Heading>
            <EngagementType
              dispatch={dispatchQuery}
              initialValues={aggregations.engagementTypes}
              query={query}
              updatedValues={searchResult ? searchResult.aggregations.engagementTypes : null}
            />
          </div>
          <div className="mb-6">
            <Heading level="2" size="small">
              Arbeidsspråk
            </Heading>
            <WorkLanguage
              dispatch={dispatchQuery}
              initialValues={aggregations.workLanguage}
              query={query}
              updatedValues={searchResult ? searchResult.aggregations.workLanguage : null}
            />
          </div>
        </Tabs.Panel>
      </Tabs>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={onCloseClick}>
        {searchResult && searchResult.totalAds
          ? `Vis ${formatNumber(searchResult.totalAds)} treff`
          : 'Vis treff'}
      </Button>
    </Modal.Footer>
  </Modal>
);

FiltersMobile.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  query: PropTypes.shape({}),
  dispatchQuery: PropTypes.func,
  aggregations: PropTypes.shape({
    engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
    occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
    published: PropTypes.arrayOf(PropTypes.shape({})),
    extent: PropTypes.arrayOf(PropTypes.shape({})),
    sector: PropTypes.arrayOf(PropTypes.shape({})),
    workLanguage: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  locations: PropTypes.arrayOf(PropTypes.shape({})),
  searchResult: PropTypes.shape({
    totalAds: PropTypes.string,
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

export default FiltersMobile;
