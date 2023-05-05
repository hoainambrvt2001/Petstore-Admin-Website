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
import { gql, useMutation, ApolloClient, InMemoryCache } from '@apollo/client';
const UPDATE_RESERVATION = gql`
mutation UpdateReservation($reservation: UpdateReservationInput!, $updateReservationId: ID!) {
  updateReservation(reservation: $reservation, id: $updateReservationId) {
    _id
    weight
    status
    species
    breed
    phoneNumber
  }
}
`;

const ReservationDetails = ({ isEdited, setIsEdited, reservationDetail, serviceTypeDetail }) => {
  const getPrice = (reservation) => {
    const price = reservation.serviceType.price.find((i) => {
      return reservation.weight >= i.minWeight && reservation.weight < i.maxWeight;
    });
    if (price) return price.priceNumber;
    else return 0;
  }

  const [values, setValues] = useState({
    userId: reservationDetail.userId.id,
    userName: reservationDetail.userName,
    phoneNumber: reservationDetail.phoneNumber,
    species: reservationDetail.species,
    breed: reservationDetail.breed,
    weight: reservationDetail.weight,
    serviceType: reservationDetail.serviceType,
    reservationDate: reservationDetail.reservationDate,
    reservationHour: reservationDetail.reservationHour,
    locationType: reservationDetail.locationType,
    region: reservationDetail.location.region,
    district: reservationDetail.location.district,
    ward: reservationDetail.location.ward,
    address: reservationDetail.location.address,
    description: reservationDetail.location.description,
    status: reservationDetail.status,
    totalPrice: getPrice(reservationDetail),
  });

  const getType = (name) => {
    for (const i in serviceTypeDetail) {
      if (serviceTypeDetail[i]._id == name) return serviceTypeDetail[i].name;
    }
    return "Other";
  }
  const userSlice = useSelector((state) => state.user);
  const handleChange = (event) => {

    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeServiceType = (event) => {

    for (const i in serviceTypeDetail) {
      if (serviceTypeDetail[i]._id == event.target.value) {
        setValues({
          ...values,
          serviceType: serviceTypeDetail[i]
        });

      };
    }

  };
  const renderReservationStatus = () => {
    const reservationStatus = ["BOOKED", "CANCELLED", "SUCCESS"];
    const statusTitle = {
      BOOKED: "Booked",
      CANCELLED: "Cancelled",
      SUCCESS: "Success",
    };
    return reservationStatus.map((status, idx) => (
      <MenuItem value={status} key={idx}>
        {statusTitle[status]}
      </MenuItem>
    ));
  };

  const renderReservationSpecies = () => {
    const reservationSpecies = ["dog", "cat"];
    const speciesTitle = {
      dog: "Dog",
      cat: "Cat",
    };
    return reservationSpecies.map((status, idx) => (
      <MenuItem value={status} key={idx}>
        {speciesTitle[status]}
      </MenuItem>
    ));
  };


  const renderReservationServiceTypes = () => {
    const service_name = [];
    const service_id = [];
    const serviceTypeTitle = {};

    for (const serviceType in serviceTypeDetail) {
      service_name.push(serviceTypeDetail[serviceType].name);
      service_id.push(serviceTypeDetail[serviceType]._id);
    }
    for (const i in service_name) {
      serviceTypeTitle[service_id[i]] = service_name[i];
    }

    return Object.keys(serviceTypeTitle).map((status, idx) => (
      <MenuItem value={status} key={idx}>
        {serviceTypeTitle[status]}
      </MenuItem>
    ));
  };
  const navigateToPageAndRefresh = (targetPage) => {
    // Navigate to the target page
    Router.push(targetPage);

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 10);
  };
  const [updateReservation, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_RESERVATION, {
    client: new ApolloClient({
      uri: "http://localhost:3000/graphql",
      cache: new InMemoryCache(),
    }),
  });
  const handleSaveChanges = async () => {

    const body = {
      status: values.status.toUpperCase(),
      species: values.species,
      serviceType: values.serviceType._id,
      breed: values.breed,
      weight: Number(values.weight),
      phoneNumber: values.phoneNumber,
    };
    
    try {
      const { data } = await updateReservation({
        variables: { reservation: body, updateReservationId: reservationDetail._id },
      });

      console.log('Updated reservation:', data.updateReservation);

      navigateToPageAndRefresh("/reservations");
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
    setIsEdited(!isEdited);


  };

  const handleSwapMode = () => {
    setIsEdited(!isEdited);
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        <CardHeader title="Reservation Detail" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="User Id"
                name="userId"
                onChange={handleChange}
                value={values.userId}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="User Name"
                name="userName"
                onChange={handleChange}
                value={values.userName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: (!isEdited),
                }}
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                onChange={handleChange}
                value={values.phoneNumber}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="select-autowidth-label">Species</InputLabel>
                <Select
                  readOnly={!isEdited}
                  labelId="select-autowidth-label"
                  name="species"
                  value={values.species}
                  onChange={handleChange}
                  label="Species"
                >
                  {renderReservationSpecies()}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: (!isEdited),
                }}
                fullWidth
                label="Breed"
                name="breed"
                onChange={handleChange}
                value={values.breed}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: (!isEdited),
                }}
                fullWidth
                label="Weight (Kg)"
                name="weight"
                onChange={handleChange}
                value={values.weight}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent >
        <CardContent>
          <Grid container spacing={3}>
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
                label="Date"
                name="reservationDate"
                onChange={handleChange}
                value={values.reservationDate.slice(0, 10)}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Time"
                name="reservationHour"
                onChange={handleChange}
                value={values.reservationHour.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="select-autowidth-label">Service Type</InputLabel>
                <Select
                  readOnly={!isEdited}
                  labelId="select-autowidth-label"
                  name="serviceType"
                  value={values.serviceType._id}
                  onChange={handleChangeServiceType}
                  label="serviceType"
                >
                  {renderReservationServiceTypes()}
                </Select>
              </FormControl>
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
                  {renderReservationStatus()}
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
              Edit reservation
            </Button>
          </Box>
        )}
      </Card>
    </form >
  );
};

export default ReservationDetails;
