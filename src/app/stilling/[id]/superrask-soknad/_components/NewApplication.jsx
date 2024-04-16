'use client';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import logAmplitudeEvent from '@/app/_common/monitoring/amplitude';

import AdDetailsHeader from './AdDetailsHeader';
import Form from './Form';
import Success from './Success';

function useNetwork() {
  const [isOnline, setNetwork] = useState(true);
  useEffect(() => {
    if (window) {
      window.addEventListener('offline', () => setNetwork(window.navigator.onLine));
      window.addEventListener('online', () => setNetwork(window.navigator.onLine));
    }
  });
  return isOnline;
}
export default function NewApplication({ ad, applicationForm, submitApplication }) {
  const [state, formAction] = useFormState(submitApplication, { validationErrors: {}, success: false });
  const [submitOffline, setSubmitOffline] = useState(false);
  const isOnline = useNetwork();

  useEffect(() => {
    if (state && state.success) {
      try {
        logAmplitudeEvent('submit superrask søknad');
      } catch (err) {
        // ignore
      }
    }
  }, [state]);

  return (
    <div className="mb-24">
      <AdDetailsHeader source={ad._source} />
      <div className="container-small">
        {state.success ? (
          <Success email={state.data.email} />
        ) : (
          <Form
            ad={ad}
            applicationForm={applicationForm}
            offlineError={submitOffline}
            submitApiError={state.error}
            validationErrors={state.validationErrors}
            submitApplication={(e) => {
              if (isOnline) {
                setSubmitOffline(false);
                formAction(e);
              } else {
                setSubmitOffline(true);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

NewApplication.propTypes = {
  ad: PropTypes.shape({
    _id: PropTypes.string,
    _source: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
  applicationForm: PropTypes.shape({}),
  submitApplication: PropTypes.func.isRequired,
};
