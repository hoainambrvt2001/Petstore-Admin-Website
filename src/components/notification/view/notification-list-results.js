import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
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
  Typography,
} from "@mui/material";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { format } from "date-fns";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";

const CHANGE_ISREAD = gql
  `mutation MarkNotificationAsRead($markNotificationAsReadId: ID!) {
  markNotificationAsRead(id: $markNotificationAsReadId)
}`

const NotificationListResults = ({ notifications, ...rest }) => {

  const [selectedNotificationIds, setSelectedNotificationIds] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const indexOfLastNotification = (page + 1) * limit;
  const indexOfFirstNotification = indexOfLastNotification - limit;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);
  const [updateRead, { loading: mutationLoading, error: mutationError }] = useMutation(CHANGE_ISREAD, {
    client: new ApolloClient({
      uri: "https://thesis-backend-production-99f6.up.railway.app/graphql",
      cache: new InMemoryCache(),
    }),
  });

  const change_Status = async (id) => {
    try {
      const { data } = await updateRead({
        variables: {
          markNotificationAsReadId: id
        }
      })
      console.log("data", data.markNotificationAsRead)

    } catch (error) {
      console.log(error);
      throw error;
    };

  }

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const renderNotificationDate = (dateString) => {
    const notificationDate = new Date(dateString);
    return format(notificationDate, "dd/MM/yyyy HH:mm:ss");
  };

  return (
    <Card {...rest}>
      <Grid container>
        <Grid item xs={12}>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentNotifications.map((notification) => (
                <TableRow
                  hover
                  key={notification._id}
                  selected={selectedNotificationIds.indexOf(notification._id) !== -1}
                  onClick={() => change_Status(notification._id)}
                >
                  <TableCell>
                    <Typography fontWeight={notification.isRead === true ? "normal" : "bold"}>
                      {notification._id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={notification.isRead === true ? "normal" : "bold"}>
                      {renderNotificationDate(notification.createdAt)}
                    </Typography></TableCell>
                  <TableCell>
                    <Typography fontWeight={notification.isRead === true ? "normal" : "bold"}>
                      {`${notification.title}
                    ${notification.orderId ? notification.orderId : notification.reservationId}
                  `}</Typography></TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Link href={notification.type === "ORDER"
                        ? `/orders/edit/${notification.orderId}?isEdited=false`
                        : `/reservations/edit/${notification.reservationId}?isEdited=false`

                      } passHref>
                        <a>
                          <MdOutlineRemoveRedEye
                            fontSize={24}
                            style={{ margin: "0px 5px", cursor: "pointer" }}
                            onClick={() => change_Status(notification._id)}
                          />
                        </a>
                      </Link>
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
        count={notifications.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Card>
  );
};

NotificationListResults.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default NotificationListResults;
