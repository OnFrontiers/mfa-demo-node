import React, { useCallback, useState } from 'react';
import Login from './Login';
import OneTimePassword from './OneTimePassword';

export default function App({ user }) {
  // user not logged in, show login form
  if (!user) return <Login />;

  return (
    <div>
      <p>
        Hello, {user.username}. <a href="/logout">Logout</a>
      </p>

      {user.mfaEnabled ? (
        <p>Confratulations, multi factor authentication is enabled.</p>
      ) : (
        <OneTimePassword />
      )}
    </div>
  );
}
