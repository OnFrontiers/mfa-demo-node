export async function login(username, password) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (res.status === 401) return {};

  const user = await res.json();

  return { user };
}
