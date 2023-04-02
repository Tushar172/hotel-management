import React from "react";
import { Box, TextField, Typography, Button } from "@mui/material";

function FilterForm({ filter, setFilter, setOpen, data, setData }) {
  const filterData = (data, filter) => {
    console.log(data);
    let rows = data;
    if (filter.userEmail)
      rows = rows.filter((row) => row.userEmail === filter.userEmail);
    if (filter.roomType)
      rows = rows.filter((row) => row.roomType === filter.roomType);
    if (filter.roomNumber)
      rows = rows.filter((row) => row.roomNumber === filter.roomNumber);

    console.log(rows);
    setData(rows);
  };

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
        Filter Bookings
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
          label="User Email"
          variant="outlined"
          onChange={(e) => {
            setFilter({
              ...filter,
              userEmail: e.target.value,
            });
          }}
        />

        <TextField
          sx={{
            width: "50%",
          }}
          id="outlined-basic"
          label="Room Type"
          variant="outlined"
          onChange={(e) => {
            setFilter({
              ...filter,
              roomType: e.target.value,
            });
          }}
        />

        <TextField
          sx={{
            width: "50%",
          }}
          id="outlined-basic"
          label="Room Number"
          variant="outlined"
          onChange={(e) => {
            setFilter({
              ...filter,
              roomNumber: e.target.value,
            });
          }}
        />
      </div>
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
          setOpen(false);
          filterData(data, filter);
        }}
      >
        Filter
      </Button>
    </Box>
  );
}

export default FilterForm;
