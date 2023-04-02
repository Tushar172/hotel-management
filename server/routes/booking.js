//create a route for booking
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const {
  checkClashForCreate,
  checkClashForUpdate,
  checkInvalidTime,
} = require("../utils/checkClash");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/all", async (req, res) => {
  // get all bookings
  const bookings = await prisma.booking.findMany();

  for (var i = 0; i < bookings.length; i++) {
    const room = await prisma.room.findUnique({
      where: {
        id: bookings[i].roomId,
      },
    });
    bookings[i].roomNumber = room.roomNumber;
    bookings[i].roomType = room.type;
  }

  res.status(200).json(bookings);
});

router.post("/create", async (req, res) => {
  const data = req.body;

  // check invalid time
  const invalidTime = checkInvalidTime(
    new Date(data.startTime),
    new Date(data.endTime)
  );

  if (invalidTime) {
    res.status(400).json({ error: "invalid time" });
    return;
  }

  const room = await prisma.room.findUnique({
    where: {
      roomNumber: data.roomNumber,
    },
  });

  if (room === null) {
    res.status(404).json({ error: "room not found" });
    return;
  }

  // check clash
  const clash = await checkClashForCreate(
    new Date(data.startTime),
    new Date(data.endTime),
    room.id
  );

  if (clash) {
    res.status(400).json({ error: "clash" });
    return;
  }

  // convert startTime and endTime to date objects
  data.startTime = new Date(data.startTime);
  data.endTime = new Date(data.endTime);

  let hours = (data.endTime.getTime() - data.startTime.getTime()) / 1000;
  hours /= 60 * 60;

  const booking = await prisma.booking.create({
    data: {
      userEmail: data.userEmail,
      startTime: data.startTime,
      endTime: data.endTime,
      room: {
        connect: {
          id: room.id,
        },
      },
      price: room.price * hours,
    },
  });

  res.status(200).json(booking);
});

router.put("/update/:id", async (req, res) => {
  // gathnering
  const data = req.body;
  const bookingId = parseInt(req.params.id);

  if (bookingId === undefined) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (booking === null) {
    res.status(404).json({ error: "booking not found" });
    return;
  }

  if (data.startTime === undefined) {
    data.startTime = booking.startTime;
  }

  if (data.endTime === undefined) {
    data.endTime = booking.endTime;
  }

  // check invalid time
  const invalidTime = checkInvalidTime(
    new Date(data.startTime),
    new Date(data.endTime)
  );
  if (invalidTime) {
    res.status(400).json({ error: "invalid time" });
    return;
  }

  if (data.roomNumber === undefined) {
    data.roomNumber = booking.room.roomNumber;
  }

  const newRoom = await prisma.room.findUnique({
    where: {
      roomNumber: data.roomNumber,
    },
  });
  if (newRoom === null) {
    res.status(404).json({ error: "room not found" });
    return;
  }

  // check clash
  const clash = await checkClashForUpdate(
    new Date(data.startTime),
    new Date(data.endTime),
    newRoom.id,
    booking.roomId
  );
  if (clash) {
    res.status(400).json({ error: "clash" });
    return;
  }

  if (data.userEmail === undefined) {
    data.userEmail = booking.userEmail;
  }

  let startTime = new Date(data.startTime);
  let endTime = new Date(data.endTime);

  let hours = (endTime.getTime() - startTime.getTime()) / 1000;
  hours /= 60 * 60;

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      userEmail: data.userEmail,
      startTime: startTime,
      endTime: endTime,
      room: {
        connect: {
          id: newRoom.id,
        },
      },
      price: newRoom.price * hours,
    },
  });

  res.status(200).json(updatedBooking);
});

router.delete("/delete/:id", async (req, res) => {
  // delete a booking

  const data = req.params;

  if (data.id === undefined) {
    res.status(400).json({ error: "id is required" });
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: parseInt(data.id),
    },
  });

  if (booking === null) {
    res.status(404).json({ error: "booking not found" });
  }

  const deletedBooking = await prisma.booking.delete({
    where: {
      id: booking.id,
    },
  });

  res.status(200).json(deletedBooking);
});

module.exports = router;
