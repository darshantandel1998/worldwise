import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import { useNavigate } from "react-router-dom";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { countryCodeToflagEmoji } from "../utils/helper";
import BackButton from "./BackButton";
import Button from "./Button";
import CountryFlag from "./CountryFlag";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const { isLoading, createCity } = useCitiesContext();
  const [isLoadingGeoCode, setIsLoadingGeoCode] = useState(false);
  const [geoCodeError, setGeoCodeError] = useState("");
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();

  useEffect(() => {
    if (!lat || !lng) return;
    const fetchCityData = async () => {
      try {
        setIsLoadingGeoCode(true);
        setGeoCodeError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 😊",
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(countryCodeToflagEmoji(data.countryCode));
      } catch (err) {
        setGeoCodeError(err.message);
      } finally {
        setIsLoadingGeoCode(false);
      }
    };
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    await createCity({
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    });
    navigate("/app/cities");
  }

  if (!lat || !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (isLoadingGeoCode) return <Spinner />;
  if (geoCodeError) return <Message message={geoCodeError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <span className={styles.flag}>
          <CountryFlag emoji={emoji} />
        </span>
      </div>
      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          dateFormat="dd/MM/yyyy"
          selected={date}
          onChange={(date) => setDate(date)}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
