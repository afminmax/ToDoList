// This code snippet gets the current written day name.
// This is how you build modular functions in JS.

exports.getDate = function() {
  //anonymous function
  const today = new Date();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  return today.toLocaleDateString('en-US', options);
};

exports.getDay = function() {
  //anonymous function
  const today = new Date();

  const options = {
    weekday: 'long'
  };

  return today.toLocaleDateString('en-US', options);
};

// checks that the two functions are tied to the module
// console.log(module.exports);
