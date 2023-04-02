const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const checkClashForCreate = async (newStartTime, newEndTime, newRoomId) => {
  const result = await prisma.$queryRaw`select count("roomId") from "Booking"
  where (
    ${newStartTime} >= "startTime" AND ${newStartTime} < "endTime"
    OR ${newEndTime} > "startTime" AND ${newEndTime} <= "endTime"
    OR ${newStartTime} <= "startTime" AND ${newEndTime} >= "endTime"
    OR ${newStartTime} >= "startTime" AND ${newEndTime} <= "endTime" )
    AND "roomId"=${newRoomId}`
  
  return result[0].count > 0;
};

const checkClashForUpdate = async (newStartTime, newEndTime, newRoomId, currentRoomId=null) => {
  const result = await prisma.$queryRaw`select count("roomId") from "Booking"
  where (
    ${newStartTime} >= "startTime" AND ${newStartTime} < "endTime"
    OR ${newEndTime} > "startTime" AND ${newEndTime} <= "endTime"
    OR ${newStartTime} <= "startTime" AND ${newEndTime} >= "endTime"
    OR ${newStartTime} >= "startTime" AND ${newEndTime} <= "endTime" )
    AND "roomId"=${newRoomId}
    AND "roomId"!=${currentRoomId}`

  return result[0].count > 0;
};

const checkInvalidTime = (newStartTime, newEndTime) => {
  return (
    newStartTime < Date.now() ||
    newEndTime < Date.now() ||
    newStartTime >= newEndTime
  );
};

module.exports = { checkClashForCreate, checkClashForUpdate, checkInvalidTime };
