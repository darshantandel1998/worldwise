import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./PageNotFound.module.css";

export default function PageNotFound() {
  return (
    <main className={styles.pageNotFound}>
      <PageNav />
      <section>
        <div>
          <h2>404 - Page not found 😢</h2>
          <p>The page you are looking for does not exist.</p>
          <p>
            <Link to="/">Go to Homepage</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
