import { Stepper, Step, StepLabel } from '@material-ui/core';
import React from 'react';
import useStyles from '../utils/styles';

export default function CheckoutWizard({activeStep= 0}) {
  const classes = useStyles();
  const steps = ['Login', 'Shipping Address', 'Payment method', 'Place Order'];
  return (
      <Stepper activeStep={activeStep} alternativeLabel className={classes.transparentBackground}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
  );
}
