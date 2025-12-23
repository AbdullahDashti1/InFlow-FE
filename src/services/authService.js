const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const signUp = async (formData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Signup failed');
  }

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    return JSON.parse(atob(data.token.split('.')[1]));
  }

  return data;
};

const signIn = async (formData) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Login failed');
  }

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    return JSON.parse(atob(data.token.split('.')[1]));
  }

  return data;
};

export {signUp, signIn};