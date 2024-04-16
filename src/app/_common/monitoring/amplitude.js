import * as amplitude from '@amplitude/analytics-browser';

import { getSessionId } from './session';

const userProperties = new amplitude.Identify();

export function initAmplitude(amplitudeToken) {
  try {
    const amplitudeKey = window.location.href.includes('nav.no') ? amplitudeToken : '';
    if (!amplitudeKey) return false;

    amplitude.init(amplitudeKey, undefined, {
      serverUrl: 'https://amplitude.nav.no/collect',
      defaultTracking: {
        pageViews: true,
        sessions: true,
        formInteractions: true,
      },
      /** Need this for /collect-auto according to https://nav-it.slack.com/archives/CMK1SCBP1/p1669722646425599
             * but seems to work fine with /collect? Keeping it here just in case.
             IngestionMetadata: {
                sourceName: window.location.toString(),
            },
             */
    });
    return true;
  } catch (e) {
    return false;
  }
}

const enrichData = (data) => ({ ...data, navSessionId: getSessionId() });

const logAmplitudeEvent = (event, data) => {
  amplitude.track(event, enrichData(data));
};

export const logSearchFilterAdded = (data) => {
  amplitude.track('Søkefilter lagt til', enrichData(data));
};

export const logSearchFilterRemoved = (data) => {
  amplitude.track('Søkefilter fjernet', enrichData(data));
};

export function logStillingVisning(adData) {
  // Todo - tror employer.location er erstattet med employer.locationList
  const employerLocation = adData.employer && adData.employer.locationList ? adData.employer.locationList[0] : null;
  let hasContactMail = false;
  let hasContactPhone = false;
  const contactList = adData.contactList ? adData.contactList : null;

  if (contactList) {
    contactList.forEach((contact) => {
      if (contact.email) hasContactMail = true;
      if (contact.phone) hasContactPhone = true;
    });
  }
  if (contactList !== null) {
    contactList.forEach((contact) => {
      if (contact.email) hasContactMail = true;
      if (contact.phone) hasContactPhone = true;
    });
  }

  logAmplitudeEvent('Stilling visning', {
    title: adData.title || 'N/A',
    id: adData.id,
    country: employerLocation ? employerLocation.country : 'N/A',
    county: employerLocation ? employerLocation.county : 'N/A',
    city: employerLocation ? employerLocation.city : 'N/A',
    employer: adData.employer && adData.employer.name ? adData.employer.name : 'N/A',
    expires: adData.expires || 'N/A',
    published: adData.published || 'N/A',
    fetchedFromSource: adData.source || 'N/A',
    hasSuperraskSoknad: adData.hasSuperraskSoknad || 'N/A',
    hasApplicationUrl: Boolean(adData.applicationUrl) || Boolean(adData.sourceUrl),
    hasApplicationEmail: Boolean(adData.applicationEmail),
    hasContactInfoMail: hasContactMail,
    hasContactInfoPhone: hasContactPhone,
    jobPostingFormat: adData.jobPostingFormat,
  });
}

function setUserProperties(property, value) {
  userProperties.set(property, value);
  amplitude.identify(userProperties);
}

export function setAuthenticatedStatus(isAuthenticated) {
  setUserProperties('is_authenticated', isAuthenticated);
  logAmplitudeEvent('auth status', { is_authenticated: isAuthenticated });
}

export default logAmplitudeEvent;
