import React, { useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DateTimePicker } from "@mui/x-date-pickers";

function Form({ edit, roomData, bookingID, selected }) {
  const [price, setPrice] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [roomNumber, setRoomNumber] = React.useState("");

  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");

  const createBooking = async () => {
    const newCheckIn = new Date(checkIn).toISOString();
    const newCheckOut = new Date(checkOut).toISOString();

    fetch("/api/booking/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
        roomNumber,
        startTime: newCheckIn,
        endTime: newCheckOut,
      }),
    }).then((res) => {
      if (res.status === 200) {
        window.location.reload();
      }
    });
  };
  const updateBooking = async () => {
    const newCheckIn = new Date(checkIn).toISOString();
    const newCheckOut = new Date(checkOut).toISOString();

    fetch(`/api/booking/update/${bookingID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
        roomNumber,
        startTime: newCheckIn,
        endTime: newCheckOut,
      }),
    }).then((res) => {
      if (res.status === 200) {
        window.location.reload();
      }
    });
  };

  const calculatePrice = () => {
    if (checkIn === null || checkOut === null || roomNumber === "") return;

    const room = roomData.find((room) => room.roomNumber === roomNumber);

    if (!room) return;

    const roomPrice = room.price;

    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);

    let hours = (checkOutTime.getTime() - checkInTime.getTime()) / 1000;
    hours /= 60 * 60;

    setPrice(hours * roomPrice);
  };

  useEffect(() => {
    calculatePrice();
  }, [checkIn, checkOut, roomNumber]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          width: "100%",
          textAlign: "center",
          padding: "0 0 10px 0",
          fontFamily: "Poppins",
          fontWeight: "bold",
          fontSize: "1.9rem",
        }}
        variant="h5"
      >
        {edit ? "Edit Booking" : "Create Booking"}
      </Typography>
      <div
        style={{
          display: "flex",
          width: "100%",

          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <TextField
          sx={{
            width: "50%",
          }}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <TextField
          sx={{
            width: "50%",
          }}
          id="outlined-basic"
          label="Room No."
          variant="outlined"
          onChange={(e) => {
            setRoomNumber(e.target.value);
          }}
        />
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={[
            "MultiInputDateTimeRangeField",
            "SingleInputDateTimeRangeField",
          ]}
        >
          <DateTimePicker
            label="Check In"
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e);
            }}
          />
          <DateTimePicker
            label="Check Out"
            value={checkOut}
            onChange={setCheckOut}
          />
        </DemoContainer>
      </LocalizationProvider>

      <div>
        <div>Price: {price}</div>

        <Button
          sx={{
            width: "100%",
            backgroundColor: "#3f51b5",
            color: "white",
            fontFamily: "Poppins",
            fontWeight: "bold",
          }}
          variant="contained"
          onClick={() => {
            edit ? updateBooking() : createBooking();
          }}
        >
          {edit ? "Update" : "Create"}
        </Button>
      </div>
    </Box>
  );
}

export default Form;
