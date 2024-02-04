import { useContext, useEffect, useState } from "react";
import Modal from "./loginModal";
import { LoginSubmit, LogoutSubmit, checkAccessTokenStatus } from "../utility";
import { OutletContext } from "../../App";

export const Home = () => {
  const [modalState, setModalState] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);

  useEffect(() => {
    const checkTokenStatus = async () => {
      const status = await checkAccessTokenStatus();
      console.log("token status: ", status);
      status === false ? setIsLoggedIn(status) : setIsLoggedIn(true);
    };
    checkTokenStatus();
  }, []);

  useEffect(() => {
    setLoginData({
      email: "",
      password: "",
    });
  }, [modalState]);

  const handleLoginInputchange = (e) => {
    const { name, value } = e.target;
    setLoginData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleLoginModal = () => {
    setModalState(!modalState);
  };

  const hanldeLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      await LoginSubmit(loginData.email, loginData.password);
      handleLoginModal();
      setIsLoggedIn(true);
    } catch (error) {
      console.error(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await LogoutSubmit();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <h1>Welcome to the admin portal.</h1>
          <button onClick={handleLogout}>Logout</button>
          <br></br>
          <br></br>
          <button onClick={checkAccessTokenStatus}>
            Check access Token expiration Test
          </button>
        </>
      ) : (
        <>
          <p>Please login to proceed:</p>
          <button onClick={() => setModalState(true)}>Login</button>
          <Modal openModal={modalState} closeModal={() => setModalState(false)}>
            <form onSubmit={hanldeLoginSubmit}>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={loginData.email}
                onChange={handleLoginInputchange}
              />
              <label>Pasword:</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputchange}
              />
              <button type="submit">Login</button>
            </form>
            <button onClick={handleLoginModal}>Close</button>
          </Modal>
          <br></br>
          <button onClick={checkAccessTokenStatus}>
            Check access Token expiration Test
          </button>
        </>
      )}
    </>
  );
};
