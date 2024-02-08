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
};

export const getAllPosts = async () => {
  try {
    const response = await fetch("http://localhost:3000/");

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.log("Error getting all posts: ", error);
    throw error;
  }
};

export const SinglePostGet = async (id) => {
  try {
    const searchUrl = `http://localhost:3000/${id}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data for single post: ${error}`);
  }
};

export const SinglePostUpdate = async (postid, title, body, published) => {
  const postBody = {
    title: title,
    body: body,
    published: published,
  };

  const handleRequest = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(postBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`post data updated: ${data}`);
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Error updating the post: ${error}`);
    }
  };
  return await handleRequest();
};

export const CommentUpdate = async (commentid, body) => {
  const commentBody = {
    body: body,
  };

  const handleRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/comments/${commentid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(commentBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`post data updated: ${data}`);
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error updating the comment id: ${commentid}: ${commentBody.body} - ${error}`
      );
    }
  };
  return await handleRequest();
};

export const CommentDelete = async (postid, commentid) => {
  const response = await fetch(`http://localhost:3000/${postid}/${commentid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log(`comment deleted from db: ${data}`);
    return data;
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }
};
