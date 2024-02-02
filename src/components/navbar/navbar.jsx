import { NavLink } from "react-router-dom";
import styles from "./nav.module.css";

function NavBar() {
  return (
    <>
      <div className={styles.nav}>
        <div className={styles.navLink}>
          <NavLink to="/">
            <img alt="Logo" src="../logo.png" className={styles.navLogo} />
          </NavLink>
        </div>
        <div className={styles.navLink}>
          <button>
            <NavLink to="/posts">Posts</NavLink>
          </button>
        </div>
        <div className={styles.navLink}>
          <button>
            <NavLink to="/about">About</NavLink>
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar;
