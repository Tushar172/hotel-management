import React from "react";
import EnhancedTable from "./EnhancedTable";
import Form from "./Form";
import { Button, Modal, Box } from "@mui/material";

import Styles from "./AdminPanel.module.scss";

function AdminPanel() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [roomData, setRoomData] = React.useState([]);
  const [edit, setEdit] = React.useState(false);
  const [bookingID, setBookingID] = React.useState("");
  const [selected, setSelected] = React.useState([]);

  const createBooking = () => {
    setOpen(true);
  };

  const editBooking = () => {
    setEdit(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    color: "black",
    borderRadius: "10px",
  };

  React.useEffect(() => {
    fetch("/api/booking/all")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  React.useEffect(() => {
    fetch("/api/room/all")
      .then((res) => res.json())
      .then((data) => {
        setRoomData(data);
      });
  }, []);

  return (
    <div className={Styles.page_container}>
      <div className={Styles.page_title_container}>
        <div className={Styles.page_title}>Sasta OYO Rooms</div>
      </div>
      <div className={Styles.table_container}>
        {data.length > 0 && (
          <EnhancedTable
            data={data}
            bookingID={bookingID}
            setBookingID={setBookingID}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>
      <div className={Styles.button_container}>
        <Button
          variant="contained"
          color="primary"
          onClick={createBooking}
          className={Styles.button}
        >
          Add New Booking
        </Button>
        <Button
          disabled={selected.length !== 1}
          variant="contained"
          color="primary"
          onClick={editBooking}
          className={Styles.button}
          sx={{
            "&:disabled": {
              backgroundColor: "grey",
              color: "white",
            },
          }}
        >
          Edit Booking
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Form edit={edit} roomData={roomData} bookingID={bookingID} />
        </Box>
      </Modal>
    </div>
  );
}

export default AdminPanel;
