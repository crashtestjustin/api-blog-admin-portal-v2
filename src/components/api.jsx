import Cookies from "js-cookie";

export async function LoginLocal(email, password) {
  const loginBody = {
    email: email,
    password: password,
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginBody),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "login Failed");
      }
    } catch (error) {
      console.error(`Error logging in: ${error}`);
      throw error;
    }
  };
  return await handleLogin();
}

export async function LogoutUser(refreshToken) {
  const logoutBody = {
    token: refreshToken,
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/logout", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logoutBody),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw errorData;
      }
    } catch (error) {
      console.log(`Error logging out: ${error}`);
      throw error;
    }
  };
  return await handleLogout();
}

export const refreshAccessToken = async () => {
  try {
    const requestBody = {
      token: Cookies.get("refreshToken"),
    };

    const response = await fetch("http://localhost:3000/users/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error("Error refreshing the access token: ", error);
    throw error;
  }
};
