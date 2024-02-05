import { useEffect, useContext } from "react";
import { OutletContext } from "../../App";
import { Home } from "../home/home";
import { checkAccessTokenStatus } from "../utility";

function Posts() {
  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);

  useEffect(() => {
    const checkTokenStatus = async () => {
      const status = await checkAccessTokenStatus();
      console.log("token status: ", status);
      status === false ? setIsLoggedIn(status) : setIsLoggedIn(true);
    };
    checkTokenStatus();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <p>Posts go here</p>
      ) : (
        <>
          <p>Posts unnaccessible while logged out.</p>
          <Home />
        </>
      )}
    </>
  );
}

export default Posts;
