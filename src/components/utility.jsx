import { LoginLocal } from "./api";
import Cookies from "js-cookie";
import { LogoutUser } from "./api";
import { refreshAccessToken } from "./api";
import { jwtDecode } from "jwt-decode";

const timefromNow = (adjustment) => {
  const date = new Date();
  date.setTime(date.getTime() + adjustment * 1000);
  return date;
};

export const LoginSubmit = async (email, password) => {
  try {
    const response = await LoginLocal(email, password);

    const { token, refreshToken } = response;

    if (token || refreshToken) {
      Cookies.set("accessToken", token, { expires: timefromNow(600) });

      Cookies.set("refreshToken", refreshToken);
      return true;
    }
  } catch (error) {
    console.error("Login Failed: ", error);
    throw error;
  }

  throw new Error("Invalid response from server");
};

export const LogoutSubmit = async () => {
  console.log("logout user activated");
  try {
    const refreshToken = Cookies.get("refreshToken");
    const result = await LogoutUser(refreshToken);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    return result;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error; // Propagate the error
  }
};

const checkRefreshTokenStatus = async () => {
  const refreshToken = Cookies.get("refreshToken");
  //   console.log("Refresh Token:", refreshToken);

  if (!refreshToken) {
    // console.log("no refresh token found");
    return false;
  }

  const decodedrefreshToken = jwtDecode(refreshToken);
  const refreshTokenExpiration = decodedrefreshToken.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  if (refreshTokenExpiration >= currentTime) {
    const result = await LogoutSubmit();
    return result;
  }
  return true;
};

export const checkAccessTokenStatus = async () => {
  const accessToken = Cookies.get("accessToken");
  //   console.log("Access token: ", accessToken);

  if (!accessToken) {
    // console.log("no access token found");
    const refreshCheck = await checkRefreshTokenStatus();
    if (refreshCheck) {
      try {
        const refreshedAccessToken = await refreshAccessToken();
        Cookies.set("accessToken", refreshedAccessToken.token, {
          expires: timefromNow(15),
        });
        console.log("access token refreshed");
        console.log(refreshedAccessToken.token);
        return true;
      } catch (error) {
        console.error("error refreshing access token: ", error);
        Cookies.remove("refreshToken");
        return false;
      }
    } else {
      return false;
    }
  }

  const decodedAccessToken = jwtDecode(accessToken);

  const accessTokenExpiration = decodedAccessToken.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime >= accessTokenExpiration) {
    try {
      const refreshedAccessToken = await refreshAccessToken();
      Cookies.set("accessToken", refreshedAccessToken.token, {
        expires: timefromNow(15),
      });
      console.log(refreshedAccessToken.token);
      return true;
    } catch (error) {
      console.error("Error refreshing access token: ", error);
      return false;
    }
  } else {
    console.log("access token is OK for now");
    return true;
  }
};
