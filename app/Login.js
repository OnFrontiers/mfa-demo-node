import React, { useCallback, useState } from 'react';
import { login } from './api';
import Input from './Input';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const res = await login(username, password);

      // For simplicity, we refresh the page after authenticating
      // and let app handle the flow
      if (res.user) return (window.location = '/');

      setInvalidCredentials(true);
    },
    [username, password]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Log in</button>

      {invalidCredentials && <p>Invalid credentials</p>}
    </form>
  );
}
