import { Link } from "react-router-dom";
import { useCitiesContext } from "../contexts/CitiesContext";
import { formatDate } from "../utils/helper";
import styles from "./CityItem.module.css";
import CountryFlag from "./CountryFlag";

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCitiesContext();
  const { id, cityName, emoji, date, position } = city;

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${id === currentCity.id ? styles["cityItem--active"] : ""}`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>
          <CountryFlag emoji={emoji} />
        </span>
        <h3 className={styles.name}> {cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
