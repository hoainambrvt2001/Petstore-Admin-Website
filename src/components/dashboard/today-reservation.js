import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SeverityPill } from "../severity-pill";
import Router from "next/router";
import { MdOutlineEdit, MdOutlineRemoveRedEye } from "react-icons/md";

export const TodayReservation = ({ reservations }) => {
  const capitalizedStr = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return "unknown"
  };
  const getPrice = (reservation) => {
    const price = reservation.serviceType.price.find((i) => {
      return reservation.weight >= i.minWeight && reservation.weight < i.maxWeight;
    });
    if (price) return price.priceNumber;
    else return 0;
  }
  const renderReservationStatus = (status) => {
    const statusTitle = {
      BOOKED: "Booked",
      CANCELLED: "Cancelled",
      SUCCESS: "Success",
    };
    return statusTitle[status.toUpperCase()];
  };

  return (
    <Card>
      <CardHeader title="Today Reservation" />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>User Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Time</TableCell>
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
              {reservations.map((reservation) => (
                <TableRow hover key={reservation.id}>
                  <TableCell>{reservation._id}</TableCell>
                  <TableCell>{reservation.userId.id}</TableCell>
                  <TableCell>{reservation.userName}</TableCell>
                  <TableCell>{`${reservation.reservationHour.timeFrame.slice(0, -3)}`}</TableCell>
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
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          variant="text"
          onClick={() => Router.push("/orders")}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};
