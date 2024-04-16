export default function capitalizeFirstLetter(string) {
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (err) {
    return string;
  }
}
