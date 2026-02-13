import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuthContext } from "../contexts/AuthContext";
import Button from "./Button";
import styles from "./PageNav.module.css";

function PageNav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthContext();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <Button type="back" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
