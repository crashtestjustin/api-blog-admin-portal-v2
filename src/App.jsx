import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./components/navbar/navbar";
import "./App.css";
import React from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("isLoggedIn state:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <div className="layout">
        <div className="header">
          <Link to={"/"}>
            <h1>CTJ&apos;s Admin Portal</h1>
          </Link>
        </div>
        <div className="navigation">
          <NavBar />
        </div>
        <div className="childComponent">
          <OutletContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <Outlet />
          </OutletContext.Provider>
        </div>
      </div>
    </>
  );
}

const OutletContext = React.createContext();

export { App, OutletContext };
