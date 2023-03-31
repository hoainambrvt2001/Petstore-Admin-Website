import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { SeverityPill } from "../../severity-pill";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { MdOutlineEdit, MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";
import Link from "next/link";

const ReservationListResults = ({ reservations, ...rest }) => {
  const [selectedReservationIds, setSelectedReservationIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const indexOfLastReservation = (page + 1) * limit;
  const indexOfFirstReservation = indexOfLastReservation - limit;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);
  reservations.map((reservation) => {
    console.log("123", reservation.serviceType.name);
  })
  console.log("abc", reservations);
  const handleSelectAll = (event) => {
    let newSelectedReservationIds;

    if (event.target.checked) {
      newSelectedReservationIds = reservations.map((reservation) => reservation._id);
    } else {
      newSelectedReservationIds = [];
    }

    setSelectedReservationIds(newSelectedReservationIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedReservationIds.indexOf(id);
    let newSelectedReservationIds = [];

    if (selectedIndex === -1) {
      newSelectedReservationIds = newSelectedReservationIds.concat(selectedReservationIds, id);
    } else if (selectedIndex === 0) {
      newSelectedReservationIds = newSelectedReservationIds.concat(selectedReservationIds.slice(1));
    } else if (selectedIndex === selectedReservationIds.length - 1) {
      newSelectedReservationIds = newSelectedReservationIds.concat(selectedReservationIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedReservationIds = newSelectedReservationIds.concat(
        selectedReservationIds.slice(0, selectedIndex),
        selectedReservationIds.slice(selectedIndex + 1)
      );
    }

    setSelectedReservationIds(newSelectedReservationIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const capitalizedStr = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return "unknown"
  };

  const renderReservationStatus = (status) => {
    const statusTitle = {
      BOOKED: "Booked",
      CANCELLED: "Cancelled",
      SUCCESS: "Success",
    };
    return statusTitle[status.toUpperCase()];
  };
  console.log("abc", reservations);
  const price = []
  const getPrice = (reservation) => {
    const price = reservation.serviceType.price.find((i) => {
      return reservation.weight >= i.minWeight && reservation.weight < i.maxWeight;
    });
    if (price) return price.priceNumber;
    else return 0;
  }
  return (
    <Card {...rest}>
      <Grid container>
        <Grid item xs={12}>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedReservationIds.length === reservations.length}
                    color="primary"
                    indeterminate={
                      selectedReservationIds.length > 0 && selectedReservationIds.length < reservations.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Id</TableCell>
                <TableCell>User Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date - Time</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Species</TableCell>
                <TableCell>Weight (Kg)</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentReservations.map((reservation) => (
                <TableRow
                  hover
                  key={reservation._id}
                  selected={selectedReservationIds.indexOf(reservation._id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedReservationIds.indexOf(reservation._id) !== -1}
                      onChange={(event) => handleSelectOne(event, reservation._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{reservation._id}</TableCell>
                  <TableCell>{reservation.userId.id}</TableCell>
                  <TableCell>{reservation.userName}</TableCell>
                  <TableCell>{`${reservation.reservationDate.slice(0, 10)} - ${reservation.reservationHour.name}`}</TableCell>
                  <TableCell>{`${reservation.phoneNumber}`}</TableCell>
                  <TableCell>{`${capitalizedStr(reservation.species)} - ${capitalizedStr(reservation.breed)}`}</TableCell>
                  <TableCell>{`${reservation.weight}`}</TableCell>
                  <TableCell>{`${reservation.serviceType.name}`}</TableCell>
                  <TableCell>{`$${getPrice(reservation)}`}</TableCell>
                  <TableCell>
                    <SeverityPill
                      color={
                        (reservation.status === "CANCELLED" && "warning") ||
                        (reservation.status === "BOOKED" && "info") ||
                        (reservation.status === "SUCCESS" && "success") ||
                        "error"
                      }
                    >
                      {renderReservationStatus(reservation.status)}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Link href={`/reservations/edit/${reservation._id}?isEdited=false`} passHref>
                        <a>
                          <MdOutlineRemoveRedEye
                            fontSize={24}
                            style={{ margin: "0px 5px", cursor: "pointer" }}
                          />
                        </a>
                      </Link>
                      <Link href={`/reservations/edit/${reservation._id}?isEdited=true`} passHref>
                        <a>
                          <MdOutlineEdit
                            fontSize={24}
                            style={{ margin: "0px 5px", cursor: "pointer" }}
                          />
                        </a>
                      </Link>
                      {/*
                      <MdDeleteOutline
                        fontSize={24}
                        style={{ margin: "0px 5px", cursor: "pointer" }}
                      /> */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <TablePagination
        component="div"
        count={reservations.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Card>
  );
};

ReservationListResults.propTypes = {
  reservations: PropTypes.array.isRequired,
};

export default ReservationListResults;
