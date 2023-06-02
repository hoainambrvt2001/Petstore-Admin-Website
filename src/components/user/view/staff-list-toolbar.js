import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Download as DownloadIcon } from "../../../icons/download";
import { Search as SearchIcon } from "../../../icons/search";
import { Upload as UploadIcon } from "../../../icons/upload";
import Router from "next/router";

const StaffListToolbar = (props) => {

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Staffs
        </Typography>
        <Box sx={{ m: 1 }}>
          {/* <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Import
          </Button>
          <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Export
          </Button> */}
          <Button color="primary" variant="contained" onClick={() => Router.push("/staffs/add")}>
            Create new staff
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StaffListToolbar;
