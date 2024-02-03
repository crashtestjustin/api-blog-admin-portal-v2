import { useEffect, useContext } from "react";
import { OutletContext } from "../../App";
import { Home } from "../home/home";

function About() {
  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);

  useEffect(() => {
    console.log(isLoggedIn);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <p>About editor go here</p>
      ) : (
        <>
          <p>About Editor unnaccessible while logged out.</p>
          <Home />
        </>
      )}
    </>
  );
}

export default About;
