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

const OrderDetails = ({ isEdited, setIsEdited, orderDetail }) => {
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

  const handleSaveChanges = async () => {
    const url = `http://localhost:3333/order/${orderDetail._id}`;
    const body = {
      status: values.status,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    };
    const updateOrder = await axios
      .patch(url, body, config)
      .then((res) => res.data)
      .catch((e) => console.log(e));

    setIsEdited(!isEdited);
  };

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
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"confirm"}>Confirm</MenuItem>
                  <MenuItem value={"delivering"}>Delivering</MenuItem>
                  <MenuItem value={"finish"}>Finish</MenuItem>
                  <MenuItem value={"cancel"}>Cancel</MenuItem>
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
