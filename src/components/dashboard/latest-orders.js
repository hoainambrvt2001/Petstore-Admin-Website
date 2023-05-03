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
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SeverityPill } from "../severity-pill";
import Router from "next/router";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export const LatestOrders = ({ orders }) => {
  const renderOrderStatus = (status) => {
    const statusTitle = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      DELIVERING: "Delivering",
      FINISHED: "Finished",
      RETURNED: "Returned",
    };
    return statusTitle[status];
  };

  return (
    <Card>
      <CardHeader title="Pending Orders" />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{"Order's ID"}</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel active direction="desc">
                      Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow hover key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.bill.firstName + " " + order.bill.lastName}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <SeverityPill
                      color={
                        (order.status === "PENDING" && "warning") ||
                        (order.status === "CONFIRMED" && "info") ||
                        (order.status === "DELIVERING" && "secondary") ||
                        (order.status === "FINISHED" && "success") ||
                        "error"
                      }
                    >
                      {renderOrderStatus(order.status)}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Link href={`/orders/edit/${order._id}?isEdited=false`} passHref>
                        <a>
                          <MdOutlineRemoveRedEye
                            fontSize={24}
                            style={{ margin: "0px 5px", cursor: "pointer" }}
                          />
                        </a>
                      </Link>
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
