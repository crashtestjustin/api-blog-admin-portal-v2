import { useEffect, useContext, useState } from "react";
import { OutletContext } from "../../App";
import { Home } from "../home/home";
import { checkAccessTokenStatus } from "../utility";
import { Link } from "react-router-dom";
import { getAllPosts } from "../api";
import styles from "./posts.module.css";

function Posts() {
  const { isLoggedIn, setIsLoggedIn } = useContext(OutletContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const checkTokenStatus = async () => {
      const status = await checkAccessTokenStatus();
      console.log("token status: ", status);
      status === false ? setIsLoggedIn(status) : setIsLoggedIn(true);
    };
    checkTokenStatus();
  }, []);

  useEffect(() => {
    const getAllThePosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts.posts);
    };
    getAllThePosts();
  }, []);

  console.log(posts);

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className={styles.header}>
            <h1>Posts</h1>
          </div>
          <div className={styles.postsSection}>
            {posts ? (
              posts.map((post) => (
                <Link to={`/posts/${post._id}`} key={post._id}>
                  <div className={styles.post}>
                    <div className={styles.title}>
                      <h3>{post.title}</h3>
                    </div>
                    <div className={styles.postStatus}>
                      <p>
                        Status:{" "}
                        {post.published === false ? "Unpublished" : "Published"}
                      </p>
                    </div>
                    <div className={styles.body}>
                      <p>{post.body}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No posts found</p>
            )}
          </div>
        </>
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
