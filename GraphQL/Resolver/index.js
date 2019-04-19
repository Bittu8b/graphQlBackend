const authResolver = require("./auth");
const bookingResolver = require("./booking");
const eventsResolver = require("./event");

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...eventsResolver
};

module.exports = rootResolver;
