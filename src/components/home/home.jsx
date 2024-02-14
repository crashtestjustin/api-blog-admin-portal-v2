import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./loginModal";
import { LoginSubmit, LogoutSubmit, checkAccessTokenStatus } from "../utility";
import { OutletContext } from "../../App";
import styles from "./home.module.css";

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

  const handleLoginModal = (e) => {
    e.preventDefault();
    setModalState(!modalState);
  };

  const hanldeLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      await LoginSubmit(loginData.email, loginData.password);
      setModalState(!modalState);
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
        <div className={styles.content}>
          <h1>Welcome to the admin portal.</h1>
          <div className={styles.navigationBtns}>
            <Link to="/create">
              <button className={styles.homeNav}>Create New Post</button>
            </Link>
            <Link to="/posts">
              <button className={styles.homeNav}>See Current Posts</button>
            </Link>
            <Link to="/about">
              <button className={styles.homeNav}>Modify About Page</button>
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <>
          <p>Please login to proceed:</p>
          <button onClick={() => setModalState(true)}>Login</button>
          <Modal openModal={modalState} closeModal={() => setModalState(false)}>
            <div className={styles.modalDiv}>
              <form onSubmit={hanldeLoginSubmit}>
                <div className={styles.formSection}>
                  <label>Email:</label>
                  <input
                    type="text"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginInputchange}
                  />
                </div>
                <div className={styles.formSection}>
                  <label>Pasword:</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginInputchange}
                  />
                </div>
                <button type="submit">Login</button>
                <button onClick={handleLoginModal}>Close</button>
              </form>
            </div>
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
