export const registerUser = async (name, mobile, password) => {
  try {
    const res = await fetch("http://192.168.1.5:5050/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile, password }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Registration error:", err);
    return { message: "Network error" };
  }
};
