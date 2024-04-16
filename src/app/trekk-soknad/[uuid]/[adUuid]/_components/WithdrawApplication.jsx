'use client';

import PropTypes from 'prop-types';
import React from 'react';
import { useFormState } from 'react-dom';

import WithdrawApplicationConfirmationRequired from './WithdrawApplicationConfirmationRequired';
import WithdrawApplicationSuccess from './WithdrawApplicationSuccess';

const WithdrawApplication = ({ ad, withdrawApplication }) => {
  const [state, formAction] = useFormState(withdrawApplication, { success: false });

  return (
    <div className="container-small mt-10 mb-24">
      {!state.success ? (
        <WithdrawApplicationConfirmationRequired
          ad={ad}
          hasError={state.error}
          isDeleting={false}
          submitForm={formAction}
        />
      ) : (
        <WithdrawApplicationSuccess />
      )}
    </div>
  );
};

WithdrawApplication.propTypes = {
  withdrawApplication: PropTypes.func.isRequired,
  ad: PropTypes.shape({}),
};

export default WithdrawApplication;
