const generateRandomString = function(length) {
  const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    randomStr += charSet[randomIndex];
  }
  return randomStr;
};

const isAlphanumeric = function(str) {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(str);
}

module.exports = {
  generateRandomString,
  isAlphanumeric
};