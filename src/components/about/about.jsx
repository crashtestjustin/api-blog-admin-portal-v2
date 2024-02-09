import { useEffect, useContext, useState } from "react";
import { OutletContext } from "../../App";
import { Home } from "../home/home";
import { checkAccessTokenStatus } from "../utility";
import { GetBioDetails, UpdateBio } from "../api";

function About() {
  const [bioloaded, setBioLoaded] = useState(false);
  const [bio, setBio] = useState(null);
  const [editMode, setEditMode] = useState(true);

  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);

  useEffect(() => {
    const checkTokenStatus = async () => {
      const status = await checkAccessTokenStatus();
      console.log("token status: ", status);
      status === false ? setIsLoggedIn(status) : setIsLoggedIn(true);

      if (!bioloaded) {
        const bio = await GetBioDetails();
        setBio(bio[0]);
        setBioLoaded(true);
      }
    };
    checkTokenStatus();
  }, [bioloaded]);

  const handleBioChanges = (e) => {
    const { name, value } = e.target;
    setBio((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(name, value);
  };

  const submitBioChanges = async (e) => {
    e.preventDefault();

    console.log(`sending id ${bio._id}`);

    try {
      const bioUpdate = await UpdateBio(bio._id, bio.name, bio.bio);

      if (bioUpdate) {
        console.log("bio updated");
        setEditMode(false);
      }
    } catch (error) {
      console.log(`Error updating the comments databse: ${error}`);
      throw new Error(error);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          {editMode ? (
            <>
              <p>About editor go here</p>
              <form method="post" onSubmit={submitBioChanges}>
                <input type="text" value={bio ? bio._id : ""} hidden readOnly />
                <div className="bioName">
                  <input
                    type="text"
                    name="name"
                    onChange={handleBioChanges}
                    value={bio ? bio.name : ""}
                  />
                </div>
                <div className="bio">
                  <textarea
                    name="bio"
                    value={bio ? bio.bio : ""}
                    onChange={handleBioChanges}
                  />
                </div>
                <div className="formSubmit">
                  <button>Save</button>
                  <button onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p>default view here</p>
              <button onClick={() => setEditMode(true)}>editMode</button>
            </>
          )}
        </>
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
