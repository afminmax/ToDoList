// This code snippet gets the current written day name.
// This is how you build modular functions in JS.

module.exports.getDate = getDate;
function getDate() {
  let today = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  let day = today.toLocaleDateString('en-US', options);
  return day;
}

module.exports.getDay = getDay;
function getDay() {
  let today = new Date();

  let options = {
    weekday: 'long'
  };

  let day = today.toLocaleDateString('en-US', options);
  return day;
}

// checks that the two functions are tied to the module
// console.log(module.exports);
