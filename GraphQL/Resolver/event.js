const Event = require("../../Models/event");
const { dateToString } = require("../../helpers/date");
const { transformEvent } = require("./merge");
const User = require("../../Models/user");

module.exports = {
  events: async (_, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!!!");
    // }

    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvents: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!!!");
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId
    });

    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const user = await User.findById(req.userId);
      // console.log("Insertion Successful " + result);
      // return { ...result._doc };

      if (!user) {
        throw new Error("User not found...");
      }
      user.createdEvents.push(event);
      await user.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  }
};
