import React from 'react';
import Login from './Login';
import OneTimePassword from './OneTimePassword';

export default function App({ user, requireMfa }) {
  // User enabled MFA but did not verify code, show OTP form
  if (requireMfa) {
    return <OneTimePassword enabled={true} />;
  }

  // User not logged in, show login form
  if (!user) {
    return <Login />;
  }

  // User is authenticated
  return (
    <div>
      <p>
        Hello, {user.username}. <a href="/logout">Logout</a>
      </p>

      {user.mfaEnabled ? (
        <p>Confratulations, multi factor authentication is enabled.</p>
      ) : (
        <OneTimePassword enabled={false} />
      )}
    </div>
  );
}
