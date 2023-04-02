const express = require("express");
const { PrismaClient } = require("@prisma/client");

const bookingRouter = require("./booking");
const roomRouter = require("./room");
const router = express.Router();

const prisma = new PrismaClient();

router.use("/booking", bookingRouter);
router.use("/room", roomRouter);

module.exports = router;
