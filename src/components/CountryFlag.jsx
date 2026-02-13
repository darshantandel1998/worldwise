import ReactCountryFlag from "react-country-flag";
import { flagEmojiToCountryCode } from "../utils/helper";

function CountryFlag({ emoji }) {
  if (!emoji) return null;
  return (
    <ReactCountryFlag
      countryCode={flagEmojiToCountryCode(emoji)}
      svg
      style={{ width: "1.5em", height: "1.5em" }}
    />
  );
}

export default CountryFlag;
