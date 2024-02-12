import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Home } from "../home/home";
import styles from "./singlepost.module.css";
import he from "he";
import { OutletContext } from "../../App";
import {
  SinglePostGet,
  SinglePostUpdate,
  CommentUpdate,
  CommentDelete,
  DeletePost,
} from "../api";
import { checkAccessTokenStatus } from "../utility";
import Modal from "./deletemodal";

function Post() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const setedittrue = queryParams.get("setedittrue");
  const { postId } = useParams();
  const [selectedPost, setPost] = useState(null);
  const [postComments, setComments] = useState(null);
  const [editMode, setEditMode] = useState(
    setedittrue === "true" ? true : false
  );
  const [commentDeleted, setCommentDeleted] = useState(false);
  const [modalState, setModalState] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenStatus = async () => {
      const status = await checkAccessTokenStatus();
      console.log("token status: ", status);
      status === false ? setIsLoggedIn(status) : setIsLoggedIn(true);
    };
    checkTokenStatus();
  }, []);

  useEffect(() => {
    const setPostsAndComments = async () => {
      const post = await SinglePostGet(postId);
      if (post) {
        setPost(post.post);
        setComments(post.comments);
      }
    };
    setPostsAndComments();
  }, [postId]);

  useEffect(() => {
    const updateComments = async () => {
      const updated = await SinglePostGet(postId);
      if (updated) {
        setComments(updated.comments);
      }
    };
    if (commentDeleted) {
      // Only fetch updated comments if a comment is deleted
      updateComments();
      setCommentDeleted(false); // Reset the state variable
    }
  }, [commentDeleted, postId]);

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

  const handleCommentChanges = (e, commentId) => {
    const { name, value } = e.target;
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === commentId) {
          const change = { ...comment, [name]: value };
          console.log(change);
          return change;
        }
        return comment;
      });
    });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await CommentDelete(postId, commentId);
      setCommentDeleted(true); // Trigger effect to fetch updated comments
    } catch (error) {
      console.log(`Error deleting comment: ${error}`);
    }
  };

  const handleSavePostandComments = async (e) => {
    e.preventDefault();

    try {
      const postUpdateResult = await SinglePostUpdate(
        selectedPost._id,
        selectedPost.title,
        selectedPost.body,
        selectedPost.published
      );

      const updateComments = async () => {
        try {
          await Promise.all(
            postComments.map(async (comment) => {
              await CommentUpdate(comment._id, comment.body);
            })
          );
          return true;
        } catch (error) {
          console.log(`Error updating the comments databse: ${error}`);
          throw new Error(error);
        }
      };

      const commentUpdateResult = await updateComments();

      if (postUpdateResult && commentUpdateResult) {
        console.log("post and comments successfully updated");
        // setEditMode(false);
        handleCancelEdit();
      }
    } catch (error) {
      console.log(`error updating records: ${error}`);
    }
  };

  const handlePostDelete = async () => {
    try {
      const postDeleteResult = await DeletePost(postId);

      if (postDeleteResult) {
        console.log(postDeleteResult);
        navigate("/posts");
      } else {
        console.error(`Unexpected status code: ${postDeleteResult.status}`);
        throw new Error(postDeleteResult);
      }
    } catch (error) {
      console.error(`Error deleting the post: ${error}`);
      throw new Error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("setedittrue");

    navigate(`${queryParams}`, {
      replace: true,
    });
  };

  const convertCommentDate = (commentDate) => {
    const comment = commentDate;
    const formattedDate = new Intl.DateTimeFormat("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/Los_Angeles",
    }).format(new Date(comment));
    return formattedDate;
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          {selectedPost ? (
            <>
              {editMode ? (
                <>
                  <form method="post" onSubmit={handleSavePostandComments}>
                    <div className={styles.heading}>
                      <label htmlFor="title">Title:</label>
                      <input
                        name="title"
                        id="title"
                        value={selectedPost.title}
                        onChange={handlePostChanges}
                      />
                      <div className={styles.publishModifier}>
                        <label htmlFor="published">
                          Select to publish the post (changes upon saving the
                          page):
                        </label>
                        <input
                          type="checkbox"
                          name="published"
                          id="published"
                          checked={selectedPost.published}
                          onChange={handleCheckboxChange}
                        />
                        <p>
                          {selectedPost.published === true
                            ? "Will  be Published"
                            : "Will be Unpublished"}
                        </p>
                      </div>
                    </div>
                    <label htmlFor="body">Post Body:</label>
                    <textarea
                      name="body"
                      id="body"
                      value={he.decode(selectedPost.body)}
                      onChange={handlePostChanges}
                    ></textarea>
                    <div>
                      <h2>Comments</h2>
                    </div>
                    <div className={styles.postedComments}>
                      {postComments.length > 0 ? (
                        <>
                          {postComments.map((comment) => (
                            <div key={comment._id} className={styles.comment}>
                              <div className={styles.username}>
                                {comment.username} |
                              </div>
                              <div className={styles.datePosted}>
                                {convertCommentDate(comment.date)}
                              </div>
                              <label hidden htmlFor={`body-${comment._id}`}>
                                Comment Body:
                              </label>
                              <textarea
                                id={`body-${comment._id}`}
                                name="body"
                                value={he.decode(comment.body)}
                                className={styles.body}
                                onChange={(e) =>
                                  handleCommentChanges(e, comment._id)
                                }
                              />
                            </div>
                          ))}
                        </>
                      ) : (
                        <p>No comments yet</p>
                      )}
                    </div>
                    <div className={styles.submitArea}>
                      <button type="submit">Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </form>
                  <div className={styles.deleteBtnHolder}>
                    <button
                      className={styles.deleteBtn}
                      // onClick={handlePostDelete}
                      onClick={() => setModalState(true)}
                    >
                      Delete Post
                    </button>
                    <Modal
                      openModal={modalState}
                      closeModal={() => setModalState(false)}
                    >
                      <p> Are you sure you want to delete the post?</p>
                      <button
                        className={styles.deleteBtn}
                        onClick={handlePostDelete}
                      >
                        Delete
                      </button>
                      <button onClick={() => setModalState(false)}>
                        Cancel
                      </button>
                    </Modal>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.heading}>
                    <h1>{selectedPost.title}</h1>
                    <a onClick={() => setEditMode(true)}>
                      <img src="/noun-edit-6537627.svg"></img>
                    </a>
                    <div className={styles.status}>
                      <p>
                        Status:{" "}
                        {selectedPost.published === true
                          ? "Published"
                          : "Unpublished"}
                      </p>
                    </div>
                  </div>
                  <p>{he.decode(selectedPost.body)}</p>
                  <div>
                    <h2>Comments</h2>
                  </div>
                  <div className={styles.postedComments}>
                    {postComments.length > 0 ? (
                      <>
                        {postComments.map((comment) => (
                          <div key={comment._id} className={styles.comment}>
                            <div className={styles.username}>
                              {comment.username} |
                            </div>
                            <div className={styles.datePosted}>
                              {convertCommentDate(comment.date)}
                            </div>
                            <a onClick={() => setEditMode(true)}>
                              <img src="/noun-edit-6537627.svg"></img>
                            </a>
                            <a onClick={() => handleDeleteComment(comment._id)}>
                              <img src="/noun-trash-3465741.svg"></img>
                            </a>
                            <div className={styles.body}>
                              {he.decode(comment.body)}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p>No comments yet</p>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <p>Post not found</p>
          )}
        </>
      ) : (
        <>
          <p>Post not available while logged out.</p>
          <Home />
        </>
      )}
    </>
  );
}

export default Post;
