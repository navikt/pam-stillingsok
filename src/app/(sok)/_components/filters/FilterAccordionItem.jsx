'use client';

import { Accordion } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

import { UserPreferencesContext } from '@/app/_common/user/UserPreferenceProvider';

function FilterAccordionItem({ title, children, panelId }) {
  const { closedFilters, addClosedFilter, removeClosedFilter } = useContext(UserPreferencesContext);
  const [isOpen, setIsOpen] = useState(!closedFilters.includes(panelId));

  function onPanelClick() {
    if (isOpen) {
      addClosedFilter(panelId);
    } else {
      removeClosedFilter(panelId);
    }
    setIsOpen(!isOpen);
  }

  return (
    <section aria-label={`${title}, søkefilter`}>
      <Accordion.Item open={isOpen}>
        <Accordion.Header onClick={onPanelClick}>{title}</Accordion.Header>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </section>
  );
}

FilterAccordionItem.propTypes = {
  panelId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default FilterAccordionItem;
