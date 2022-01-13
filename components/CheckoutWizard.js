import { Stepper, Step, StepLabel } from '@material-ui/core';
import React from 'react';

export default function CheckoutWizard({activeStep= 0}) {
  const steps = ['Login', 'Shipping Address', 'Payment method', 'Place Order'];
  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
