import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <br />
      <input {...props} />
      <br />
      <br />
    </div>
  );
}
