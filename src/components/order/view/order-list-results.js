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
} from "@mui/material";
import { MdOutlineEdit, MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";
import { format } from "date-fns";
import { SeverityPill } from "../../severity-pill";
import Link from "next/link";

const OrderListResults = ({ orders, ...rest }) => {
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const indexOfLastOrder = (page + 1) * limit;
  const indexOfFirstOrder = indexOfLastOrder - limit;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const handleSelectAll = (event) => {
    let newSelectedOrderIds;

    if (event.target.checked) {
      newSelectedOrderIds = orders.map((order) => order._id);
    } else {
      newSelectedOrderIds = [];
    }

    setSelectedOrderIds(newSelectedOrderIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedOrderIds.indexOf(id);
    let newSelectedOrderIds = [];

    if (selectedIndex === -1) {
      newSelectedOrderIds = newSelectedOrderIds.concat(selectedOrderIds, id);
    } else if (selectedIndex === 0) {
      newSelectedOrderIds = newSelectedOrderIds.concat(selectedOrderIds.slice(1));
    } else if (selectedIndex === selectedOrderIds.length - 1) {
      newSelectedOrderIds = newSelectedOrderIds.concat(selectedOrderIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedOrderIds = newSelectedOrderIds.concat(
        selectedOrderIds.slice(0, selectedIndex),
        selectedOrderIds.slice(selectedIndex + 1)
      );
    }

    setSelectedOrderIds(newSelectedOrderIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const renderOrderDate = (dateString) => {
    const orderDate = new Date(dateString);
    return format(orderDate, "dd/MM/yyyy");
  };

  const renderShipTo = (bill) => {
    const { region, district, ward, address } = bill;
    return `${address}, ${ward}, ${district}, ${region}`;
  };

  const renderPayment = (method) => {
    const paymentObj = {
      paypal: "Paypal",
      cod: "COD",
    };
    return paymentObj[method];
  };

  const renderOrderStatus = (status) => {
    const statusTitle = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      FINISHED: "Finished",
      RETURNED: "Returned",
    };
    return statusTitle[status];
  };
  )
  return (
    <Card {...rest}>
      <Grid container>
        <Grid item xs={12}>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedOrderIds.length === orders.length}
                    color="primary"
                    indeterminate={
                      selectedOrderIds.length > 0 && selectedOrderIds.length < orders.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Ship to</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow
                  hover
                  key={order._id}
                  selected={selectedOrderIds.indexOf(order._id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedOrderIds.indexOf(order._id) !== -1}
                      onChange={(event) => handleSelectOne(event, order._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{`${order.bill.firstName} ${order.bill.lastName}`}</TableCell>
                  <TableCell>{renderOrderDate(order.createdAt)}</TableCell>
                  <TableCell>{renderShipTo(order.bill)}</TableCell>
                  <TableCell>
                    <SeverityPill
                      color={
                        (order.status === "PENDING" && "warning") ||
                        (order.status === "CONFIRMED" && "info") ||
                        (order.status === "FINISHED" && "success") ||
                        "error"
                      }
                    >
                      {renderOrderStatus(order.status)}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>{"$" + order.totalPrice}</TableCell>
                  <TableCell>{renderPayment(order.bill.paymentMethod)}</TableCell>
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
                      <Link href={`/orders/edit/${order._id}?isEdited=true`} passHref>
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
        count={orders.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Card>
  );
};

OrderListResults.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrderListResults;
