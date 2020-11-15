import React, { useState } from 'react';
import Login from './Login';

export default function App({ user }) {
  // user not logged in, show login form
  if (!user) return <Login />;

  return (
    <div>
      Hello, {user.username}. <a href="/logout">Logout</a>
    </div>
  );
}
