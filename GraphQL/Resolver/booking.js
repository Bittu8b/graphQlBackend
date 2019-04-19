const Event = require("../../Models/event");
const Booking = require("../../Models/booking");

const { userFn, transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!!!");
    // }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async args => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!!!");
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });
    const result = await booking.save();

    return transformBooking(result);
  },

  cancelEvent: async args => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!!!");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        creator: userFn.bind(this, booking.event._doc.creator)
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
