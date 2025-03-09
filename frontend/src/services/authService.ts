const BASE_URL = "http://localhost:7000/user"; // Adjust based on your backend URL

export const registerUser = async (user: { email: string; password: string }) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const loginUser = async (user: { email: string; password: string }) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return response.json();
};
