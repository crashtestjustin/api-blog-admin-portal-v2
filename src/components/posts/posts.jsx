import { useEffect, useContext, useState } from "react";
import { OutletContext } from "../../App";
import { Home } from "../home/home";
import { checkAccessTokenStatus } from "../utility";
import { Link } from "react-router-dom";
import { getAllPosts } from "../api";
import styles from "./posts.module.css";
import he from "he";

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
      if (isLoggedIn) {
        const allPosts = await getAllPosts();
        setPosts(allPosts.posts);
      }
    };
    getAllThePosts();
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className={styles.header}>
            <h1>Posts</h1>
          </div>
          <div className={styles.createNew}>
            <Link to="/create">
              <button>Create New Post</button>
            </Link>
          </div>
          <div className={styles.postsSection}>
            {posts ? (
              posts.map((post) => (
                <div key={post._id} className={styles.postBlock}>
                  <Link to={`/posts/${post._id}`}>
                    <div className={styles.post}>
                      <div className={styles.title}>
                        <h3>{post.title}</h3>
                      </div>
                      <div className={styles.postStatus}>
                        <p>
                          Status:{" "}
                          {post.published === false
                            ? "Unpublished"
                            : "Published"}
                        </p>
                      </div>
                      <div
                        className={styles.body}
                        dangerouslySetInnerHTML={{
                          __html: he.decode(`${post.body.substring(0, 85)}...`),
                        }}
                      />
                    </div>
                  </Link>
                  <div className={styles.modfyBtns}>
                    <Link
                      to={{
                        pathname: `/posts/${post._id}`,
                        search: `?setedittrue=true`,
                      }}
                    >
                      <img
                        className={styles.postsEditImg}
                        src="/public/edit.svg"
                      />
                    </Link>
                    <Link
                      to={{
                        pathname: `/posts/${post._id}`,
                        search: `?setedittrue=true&setdeletemodaltrue=true`,
                      }}
                    >
                      <img
                        className={styles.postsEditImg}
                        src="/public/trash.svg"
                      />
                    </Link>
                  </div>
                </div>
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
