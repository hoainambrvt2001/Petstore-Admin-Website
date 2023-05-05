import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import Router from "next/router";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";

const OrderDetails = ({ isEdited, setIsEdited, orderDetail }) => {
  const UPDATE_ORDER = gql`
  mutation Mutation($updateOrderId: ID!, $input: UpdateOrderInput!) {
    updateOrder(id: $updateOrderId, input: $input) {
      data {
        status
      }
    }
  }
  `
  const [values, setValues] = useState({
    firstName: orderDetail.bill.firstName,
    lastName: orderDetail.bill.lastName,
    email: orderDetail.bill.email,
    phone: orderDetail.bill.phone,
    company: orderDetail.bill.company,
    region: orderDetail.bill.region,
    district: orderDetail.bill.district,
    ward: orderDetail.bill.ward,
    address: orderDetail.bill.address,
    orderComment: orderDetail.bill.orderComment,
    paymentMethod: orderDetail.bill.paymentMethod,
    totalPrice: orderDetail.totalPrice,
    shippingFee: orderDetail.shippingFee,
    status: orderDetail.status,
  });
  const userSlice = useSelector((state) => state.user);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const renderOrderStatus = () => {
    const orderStatus = ["PENDING", "CONFIRMED", "CANCELLED", "FINISHED", "RETURNED"];
    const statusTitle = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      FINISHED: "Finished",
      RETURNED: "Returned",
    };
    if (orderDetail.status === "PENDING") {
      return orderStatus.slice(0, 3).map((status, idx) => (
        <MenuItem value={status} key={idx}>
          {statusTitle[status]}
        </MenuItem>
      ));
    } else if (orderDetail.status === "CONFIRMED") {
      return orderStatus.slice(1, 4).map((status, idx) => (
        <MenuItem value={status} key={idx}>
          {statusTitle[status]}
        </MenuItem>
      ));
    } else if (orderDetail.status === "FINISHED") {
      return orderStatus.slice(3, 5).map((status, idx) => (
        <MenuItem value={status} key={idx}>
          {statusTitle[status]}
        </MenuItem>
      ));
    } else if (orderDetail.status === "RETURNED") {
      return orderStatus.slice(4, 5).map((status, idx) => (
        <MenuItem value={status} key={idx}>
          {statusTitle[status]}
        </MenuItem>
      ));
    } else if (orderDetail.status === "CANCELLED") {
      return orderStatus.slice(2, 4).map((status, idx) => (
        <MenuItem value={status} key={idx}>
          {statusTitle[status]}
        </MenuItem>
      ));
    }
  };
  const navigateToPageAndRefresh = (targetPage) => {
    // Navigate to the target page
    Router.push(targetPage);

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 10);
  };
  const [updateOrder, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_ORDER, {
    client: new ApolloClient({
      uri: "http://localhost:3000/graphql",
      cache: new InMemoryCache(),
    }),
  });
  const handleSaveChanges = async () => {
    const body = {
      status: values.status,
    };

    try {
      const { data } = await updateOrder({
        variables: { input: body, updateOrderId: orderDetail._id },
      });

      

      navigateToPageAndRefresh("/orders");
    } catch (error) {

    };
  }
  const handleSwapMode = () => {
    setIsEdited(!isEdited);
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        <CardHeader title="Order Detail" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="First Name"
                name="firstName"
                onChange={handleChange}
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Last Name"
                name="lastName"
                onChange={handleChange}
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Company"
                name="company"
                onChange={handleChange}
                value={values.company}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Province/City"
                name="region"
                onChange={handleChange}
                value={values.region}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="District"
                name="district"
                onChange={handleChange}
                value={values.district}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Ward"
                name="ward"
                onChange={handleChange}
                value={values.ward}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Address"
                name="address"
                onChange={handleChange}
                value={values.address}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Payment Method"
                name="paymentMethod"
                onChange={handleChange}
                value={values.paymentMethod}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
                fullWidth
                label="Total Price"
                name="totalPrice"
                onChange={handleChange}
                value={values.totalPrice}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography>$</Typography>,
                }}
                fullWidth
                label="Shipping Fee"
                name="shippingFee"
                onChange={handleChange}
                value={values.shippingFee}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="select-autowidth-label">Status</InputLabel>
                <Select
                  readOnly={!isEdited}
                  labelId="select-autowidth-label"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {renderOrderStatus()}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        {isEdited ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Button color="primary" variant="contained" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Button color="primary" variant="contained" onClick={handleSwapMode}>
              Edit product
            </Button>
          </Box>
        )}
      </Card>
    </form>
  );
};

export default OrderDetails;
