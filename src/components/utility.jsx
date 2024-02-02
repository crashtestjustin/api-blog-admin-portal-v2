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
  const response = await LoginLocal(email, password);

  const { token, refreshToken } = response;

  if (token || refreshToken) {
    Cookies.set("accessToken", token, { expires: timefromNow(600) });
    Cookies.set("refreshToken", refreshToken, {
      expires: timefromNow(7200),
    });
    return true;
  }

  throw new Error(); // Throw the error to be caught by the calling code
};

export const LogoutSubmit = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");
    await LogoutUser(refreshToken);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  } catch (error) {
    return error;
  }
};

const isAccessTokenExpired = () => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken === undefined) {
    Cookies.remove("accessToken");
    return undefined;
  }

  const decodedToken = jwtDecode(accessToken);
  const accessTokenExpiration = decodedToken.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime >= accessTokenExpiration) {
    Cookies.remove("accessToken");
    return true;
  }
  return false;
};

export const checkAccessTokenStatus = async () => {
  try {
    const checkResult = isAccessTokenExpired();
    if (checkResult) {
      console.log("access token expired. Obtainig a new one");
      const refreshedAccessToken = await refreshAccessToken();
      Cookies.set("accessToken", refreshedAccessToken.token, {
        expires: timefromNow(600),
      });
      console.log(`token refreshed....`);
    } else if (checkResult === undefined) {
      console.log("No access token");
    } else {
      console.log("access token is OK for now.");
    }
  } catch (error) {
    console.error(`Error refreshing access token: ${error.message}`);
  }
};
