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

const ServiceListToolbar = (props) => {
  const [searchText, setSearchText] = useState("");

  const handleChangeSearch = async (e) => {
    setSearchText(e.target.value);
    Router.replace({
      pathname: "/service",
      query: {
        searchText: e.target.value,
      },
    });
  };

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
          Services
        </Typography>
        <Box sx={{ m: 1 }}>
          {/* <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Import
          </Button>
          <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Export
          </Button> */}
          <Button color="primary" variant="contained" onClick={() => Router.push("/services/add")}>
            Add service
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search product"
                variant="outlined"
                value={searchText}
                onChange={handleChangeSearch}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ServiceListToolbar;
