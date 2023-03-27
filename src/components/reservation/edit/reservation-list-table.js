import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Box, Card, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { getInitials } from "../../../utils/get-initials";

const columns = [
  { flex: 0.25, field: "id", headerName: "Id", minWidth: 100 },
  {
    flex: 0.5,
    field: "name",
    headerName: "Name",
    minWidth: 100,
    renderCell: ({ row }) => {
      const { name, images } = row;
      return (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <Avatar
            src={images[0].url}
            alt={images[0].image_name}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {getInitials(name)}
          </Avatar>
          <Typography color="textPrimary" variant="body2">
            {name}
          </Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    field: "price",
    headerName: "Price",
    minWidth: 100,
    renderCell: ({ row }) => <Typography variant="body2">{"$" + row.price}</Typography>,
  },
  { flex: 0.1, field: "quantity", headerName: "Quantity", minWidth: 100 },
];

export default function ReservationListTable({ cart }) {
  return (
    <Card sx={{ mb: 5 }}>
      <CardHeader title="Reservation List" />
      <Divider />
      <Grid container>
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            pagination
            rowHeight={90}
            rows={cart}
            columns={columns}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                borderRadius: 0,
                borderBottom: "1px solid rgb(224, 224, 224)",
                backgroundColor: "#F3F4F6",
              },
              "& .MuiDataGrid-columnSeparator": {
                color: "#a9a9a9",
              },
            }}
            rowsPerPageOptions={[5]}
            pageSize={5}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
