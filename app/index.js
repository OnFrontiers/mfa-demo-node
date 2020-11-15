import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { login } from './api';
import App from './App';

(async () => {
  // try to login with cookie
  const res = await login();

  // init app
  const domContainer = document.createElement('div');
  document.body.appendChild(domContainer);
  ReactDOM.render(<App user={res.user} />, domContainer);
})();
