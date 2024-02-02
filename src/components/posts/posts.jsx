import { useEffect, useContext } from "react";
import { OutletContext } from "../../App";
import { Home } from "../home/home";

function Posts() {
  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);

  const pageState = "modify posts";

  useEffect(() => {
    console.log(isLoggedIn);
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
