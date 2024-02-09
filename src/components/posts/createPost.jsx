import styles from "./createpost.module.css";
import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { OutletContext } from "../../App";
import { checkAccessTokenStatus } from "../utility";
import { Home } from "../home/home";
import { CreateNewPost } from "../api";

function CreatePost() {
  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);
  const [postContent, setPost] = useState({
    title: "",
    body: "",
    published: false,
  });

  useEffect(() => {
    const checkTokenStatus = async () => {
      const status = await checkAccessTokenStatus();
      console.log("token status: ", status);
      status === false ? setIsLoggedIn(status) : setIsLoggedIn(true);
    };
    checkTokenStatus();
  }, []);

  const handleCheckboxChange = (e) => {
    console.log("Checkbox checked:", e.target.checked);
    const { name, checked } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handlePostChanges = (e) => {
    const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <form method="post">
            <div className={styles.heading}>
              <label htmlFor="title">Title:</label>
              <input
                name="title"
                id="title"
                value={postContent.title}
                onChange={handlePostChanges}
              />
              <div className={styles.publishModifier}>
                <label htmlFor="published">
                  Do you want to publosh this post once created?
                </label>
                <input
                  type="checkbox"
                  name="published"
                  id="published"
                  checked={postContent.published}
                  onChange={handleCheckboxChange}
                />
                <p>
                  {postContent.published === true
                    ? "Will  be Published"
                    : "Will remain as a draft"}
                </p>
              </div>
            </div>
            <label htmlFor="body">Post Body:</label>
            <textarea
              name="body"
              id="body"
              value={postContent.body}
              onChange={handlePostChanges}
            ></textarea>
            <div className={styles.submitButtons}>
              <button>Create</button>
              <Link to={"/posts"}>
                <button>Cancel</button>
              </Link>
            </div>
          </form>
        </>
      ) : (
        <>
          <p>Cannot Create posts while logged out.</p>
          <Home />
        </>
      )}
    </>
  );
}

export default CreatePost;
