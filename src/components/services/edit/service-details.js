import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import Router from "next/router";
import { useSelector } from "react-redux";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
const UPDATE_SERVICE = gql`
mutation Mutation($updateServiceTypeId: ID!, $serviceType: UpdateServiceTypeInput!) {
  updateServiceType(id: $updateServiceTypeId, serviceType: $serviceType) {
    _id
    name
    price {
      name
      serviceId
      price
      priceNumber
      minWeight
      maxWeight
      updatedAt
    }
    description
    timeServe
  }
}
  `
const ServiceDetails = ({ isEdited, setIsEdited, serviceDetail }) => {
  const [values, setValues] = useState({
    name: serviceDetail.name,
    description: serviceDetail.description,
    price: serviceDetail.price.map(({ __typename, ...rest }) => rest),
    timeServe: serviceDetail.timeServe,
  });

  const [numGrids, setNumGrids] = useState(0);
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const handleSwapMode = () => {
    setIsEdited(!isEdited);
  };
  const handleAddPrice = async () => {
    setValues({
      ...values,
      price: [...values.price,
      {
        name: "",
        serviceId: "",
        price: "",
        priceNumber: "",
        minWeight: "",
        maxWeight: 999999,
        updatedAt: ""
      }
      ]
    })
  }
  const handleRemovePrice = async () => {
    if (values.price.length > 1) {
      const newList = [...values.price]
      newList.pop()
      setValues({
        ...values,
        price: newList,
      })
    }
  }
  const handlePriceChange = (index, event) => {
    const { name, value } = event.target;
    const newPrices = [...values.price];
    newPrices[index] = {
      ...newPrices[index],
      [name]: value,
    };
    setValues({
      ...values,
      price: newPrices,
    });
  };
  const handlePriceName = () => {

    const newPriceList = values.price.map((price, index) => {
      return {
        ...price,
        name: `${values.name} price ${(index + 1)}`,
        serviceId: Number(index + 1),
        priceNumber: Number(price.priceNumber),
        price: `$${price.priceNumber}`,
        minWeight: Number(price.minWeight),
        maxWeight: Number(price.maxWeight),
        updatedAt: new Date().toISOString(),
      };
    });

    setValues({
      ...values,
      price: newPriceList,
    });

    return 1;
  };

  const navigateToPageAndRefresh = (targetPage) => {
    // Navigate to the target page
    Router.push(targetPage);

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  const userSlice = useSelector((state) => state.user);
  const [updateService, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_SERVICE, {
    client: new ApolloClient({
      uri: 'https://thesis-backend-production-99f6.up.railway.app/graphql',
      cache: new InMemoryCache(),
    })
  })
  const handleAddService = async () => {
    try {
      handlePriceName();

      const { data } = await updateService({
        variables: {
          serviceType: values,
          updateServiceTypeId: serviceDetail._id,
        },

      });

      window.location.href = "/services";
    }
    catch (error) {
      console.error('Error update service:', error.message);
    }
  };

  return (
    <form autoComplete="off" noValidate encType="multipart/form-data">
      <Card>
        <CardHeader title="Service Detail" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                InputProps={{
                  readOnly: (!isEdited),
                }}
                fullWidth
                label="Name"
                placeholder="Enter name"
                name="name"
                onChange={handleChange}
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                InputProps={{
                  readOnly: (!isEdited),
                }}
                multiline
                minRows={10}
                fullWidth
                label="Description"
                placeholder="Enter discription"
                name="description"
                onChange={handleChange}
                value={values.description}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Prices" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {values.price.map((price, index) => (
              <div key={index}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>

                      <Grid item md={4} xs={12}>
                        <TextField
                          InputProps={{
                            readOnly: (!isEdited),
                          }}
                          fullWidth
                          type="number"
                          label="Min Weight"
                          placeholder="Enter weight"
                          name="minWeight"
                          onChange={(event) => handlePriceChange(index, event)}
                          value={price.minWeight}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          InputProps={{
                            readOnly: (!isEdited),
                          }}
                          fullWidth
                          type="number"
                          label="Max Weight"
                          placeholder="Enter weight"
                          name="maxWeight"
                          onChange={(event) => handlePriceChange(index, event)}
                          value={price.maxWeight}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          InputProps={{
                            readOnly: (!isEdited),
                          }}
                          fullWidth
                          type="number"
                          label="Price"
                          placeholder="Enter price"
                          name="priceNumber"
                          onChange={(event) => handlePriceChange(index, event)}
                          value={(price.priceNumber)}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            ))}
            {isEdited &&
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <Button color="primary" variant="contained" onClick={handleAddPrice}>
                  Add Price
                </Button>
              </Box>
            }
            {values.price.length > 1 && isEdited &&
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <Button color="error" variant="contained" onClick={handleRemovePrice}>
                  Remove Price
                </Button>
              </Box>
            }
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="time-serve-label">Time Serve</InputLabel>
                <Select
                  name="timeServe"
                  labelId="time-serve-label"
                  value={values.timeServe}
                  label="Category"
                  onChange={handleChange}
                >
                  <MenuItem value="30 mins">30 minutes</MenuItem>
                  <MenuItem value="1 hour">1 hour</MenuItem>
                  <MenuItem value="1 hour 30mins">1 hour 30 minutes</MenuItem>
                  <MenuItem value="2 hours">2 hours</MenuItem>
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
            <Button color="primary" variant="contained" onClick={handleAddService}>
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
              Edit service
            </Button>
          </Box>
        )}
      </Card>
    </form >
  );
};

export default ServiceDetails;
