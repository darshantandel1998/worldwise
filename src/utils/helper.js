export const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export const countryCodeToflagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => char.charCodeAt() + 127397);
  return String.fromCodePoint(...codePoints);
};

export const flagEmojiToCountryCode = (flagEmoji) => {
  const charCodes = Array.from(flagEmoji).map(
    (char) => char.codePointAt() - 127397,
  );
  return String.fromCharCode(...charCodes);
};
