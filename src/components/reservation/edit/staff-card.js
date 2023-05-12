import { Avatar, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";

const StaffCard = ({ staff, onClick }) => {
  const { firstName, lastName, avatar } = staff;

  const handleClick = () => {
    onClick(staff); // Pass the selected staff to the onClick callback
  };

  return (
    <div className="staff-card" onClick={handleClick}>
      <Avatar src={avatar ? avatar.url : "/static/images/avatars/blank_avatar.png"}
        alt="Staff Avatar"
        sx={{ width: 56, height: 56, mr: 2 }} />
      <Typography>{`${firstName} ${lastName}`}</Typography>
    </div>
  );
};

const StaffSelection = ({ staffList, setStaff, currentStaff, isEdited }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(currentStaff);

  const openOverlay = () => {
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    console.log("selected", selectedStaff);
    setStaff(staff);
    closeOverlay();
  };

  return (

    <Grid item md={12} xs={12}>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="select-autowidth-label">Staff</InputLabel>
        <Select
          labelId="select-autowidth-label"
          value={selectedStaff ? selectedStaff.id : ''}
          open={isOpen}
          onOpen={openOverlay}
          onClose={closeOverlay}
          label="Staff"
          readOnly={!isEdited}
        >
          {staffList.map((staff) => (
            <MenuItem key={staff.id} value={staff.id} onClick={() => handleStaffSelect(staff)}>
              <div>
                <Avatar src={staff.avatar ? staff.avatar.url : "/static/images/avatars/blank_avatar.png"} alt="Staff Avatar" sx={{ width: 56, height: 56, mr: 2 }} />
                <h3>{`${staff.firstName} ${staff.lastName}`}</h3>
                <Typography>{`${staff.phone ? staff.phone : ""}`}</Typography>
                <Typography>{`${staff.email}`}</Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default StaffSelection
