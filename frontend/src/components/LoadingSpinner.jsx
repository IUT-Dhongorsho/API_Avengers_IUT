import React from 'react';

export default function LoadingSpinner({ small }) {
  return <div className={small ? 'spinner spinner-sm' : 'spinner'} aria-hidden="true" />;
}
