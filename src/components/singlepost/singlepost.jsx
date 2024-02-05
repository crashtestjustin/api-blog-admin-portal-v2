import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Home } from "../home/home";
import styles from "./singlepost.module.css";
import he from "he";
import { OutletContext } from "../../App";
import { SinglePostGet } from "../api";
import { checkAccessTokenStatus } from "../utility";

function Post() {
  const { postId } = useParams();
  const [selectedPost, setPost] = useState(null);
  const [postComments, setComments] = useState(null);

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
    console.log("Current postId:", postId);
    const setPostsAndComments = async () => {
      const post = await SinglePostGet(postId);
      if (post) {
        setPost(post.post);
        setComments(post.comments);
      }
    };
    setPostsAndComments();
  }, [postId]);

  console.log(selectedPost);
  console.log(postComments);

  return (
    <>
      {isLoggedIn ? (
        <p>Single post and editor goes here</p>
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
