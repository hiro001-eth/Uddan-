// This component is no longer used for the header logo. Keeping it in case other parts reference it.
import React from 'react';

const GradientLogo = ({ size = 200, className = "" }) => (
  <img
    src={'/app_logo-removebg-preview.png'}
    alt="Udaan Agencies"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

export default GradientLogo; 