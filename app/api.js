export async function login(username, password) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (res.status === 401) {
    return { requireMfa: false };
  }

  if (res.status === 403) {
    return { requireMfa: true };
  }

  const user = await res.json();
  return { user, requireMfa: false };
}

export async function verifyOtp(code) {
  const res = await fetch('/verify_otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  return res.json();
}
