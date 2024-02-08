import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Home } from "../home/home";
import styles from "./singlepost.module.css";
import he from "he";
import { OutletContext } from "../../App";
import {
  SinglePostGet,
  SinglePostUpdate,
  CommentUpdate,
  CommentDelete,
} from "../api";
import { checkAccessTokenStatus } from "../utility";

function Post() {
  const { postId } = useParams();
  const [selectedPost, setPost] = useState(null);
  const [postComments, setComments] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [commentDeleted, setCommentDeleted] = useState(false);

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
        setEditMode(false);
      }
    } catch (error) {
      console.log(`error updating records: ${error}`);
    }
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

                    <div className={styles.postedComments}>
                      {postComments ? (
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
                      <button onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                  </form>
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
                  <div className={styles.postedComments}>
                    {postComments ? (
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
