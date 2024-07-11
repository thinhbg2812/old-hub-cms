export function checkNoSpecialCharacters(inputString) {
  const pattern = /^[a-zA-Z0-9 ]*$/;
  return pattern.test(inputString);
}
