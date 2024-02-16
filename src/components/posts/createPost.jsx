import styles from "./createpost.module.css";
import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OutletContext } from "../../App";
import { checkAccessTokenStatus } from "../utility";
import { Home } from "../home/home";
import { CreateNewPost } from "../api";
import ReactQuill from "react-quill";

function CreatePost() {
  const navigate = useNavigate();
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
    const { name, checked } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handlePostChanges = (name, value) => {
    // const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitPostCreate = async (e) => {
    e.preventDefault();

    try {
      const postCreationResult = await CreateNewPost(
        postContent.title,
        postContent.body,
        postContent.published
      );

      if (postCreationResult) {
        const postId = postCreationResult._id;

        navigate(`/posts/${postId}`);
      }
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <form
            className={styles.newPostForm}
            method="post"
            onSubmit={submitPostCreate}
          >
            <div className={styles.heading}>
              <label htmlFor="title">Title:</label>
              <input
                name="title"
                id="title"
                value={postContent.title}
                onChange={(e) => handlePostChanges("title", e.target.value)}
              />
              <div className={styles.publishModifier}>
                <label htmlFor="published">
                  Do you want to publish this post once created?
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
            <label hidden htmlFor="body">
              Post Body:
            </label>
            {/* <textarea
              name="body"
              id="body"
              value={postContent.body}
              onChange={handlePostChanges}
            ></textarea> */}
            <ReactQuill
              className={styles.quillEditor}
              theme="snow"
              name="body"
              id="body"
              value={postContent.body || ""}
              onChange={(value) => handlePostChanges("body", value)}
            />
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
