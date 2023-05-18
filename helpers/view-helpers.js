// Import the Handlebars library
const Handlebars = require('handlebars');

// Register the `not` helper

// Register the `eq` helper
Handlebars.registerHelper('eq', function (value1, value2) {
  return value1 === value2;
});

// Export the registered helpers or the Handlebars instance
module.exports = Handlebars;