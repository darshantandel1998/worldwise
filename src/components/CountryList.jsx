import { useCitiesContext } from "../contexts/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

function CountryList() {
  const { isLoading, cities } = useCitiesContext();

  const countries = cities.reduce((arr, city) => {
    if (!arr.find((country) => country.country === city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    return arr;
  }, []);

  if (isLoading) return <Spinner />;
  if (!countries.length)
    return (
      <Message message="Add your first country by clicking on a city on the map" />
    );
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
