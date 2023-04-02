// OUT OF SCOPE OF JUDGING

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/all", async (req, res) => {
  // get all rooms
  const rooms = await prisma.room.findMany();

  res.status(200).json(rooms);
});

router.post("/create", async (req, res) => {
  const data = req.body;

  try {
    const room = await prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        type: data.type,
        price: data.price,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  res.json(room);
});

module.exports = router;
