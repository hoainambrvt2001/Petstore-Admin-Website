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
const CREATE_SERVICE = gql`
  mutation Mutation($serviceType: ServiceTypeInput!) {
    createServiceType(serviceType: $serviceType) {
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
      selectedCount
      description
      timeServe
      typeId
    }
  }
  `
const AddServiceForm = ({ categories }) => {
  const [values, setValues] = useState({
    name: "",
    typeId: 0,
    price: [],
    selectedCount: 0,
    description: "",
    timeServe: "",
  });

  const [prices, setPrices] = useState([{
    name: "",
    serviceId: 0,
    price: "",
    priceNumber: "",
    minWeight: "",
    maxWeight: "",
    updatedAt: ""

  }])
  const [numGrids, setNumGrids] = useState(0);
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const handleAddPrice = async () => {
    setPrices([...prices, {
      name: "",
      serviceId: "",
      price: "",
      priceNumber: "",
      minWeight: "",
      maxWeight: 999999,
      updatedAt: ""
    }])
  }
  const handleRemovePrice = async () => {
    if (prices.length > 1) {
      setPrices(prices.slice(0, -1));
    }
  }
  const handlePriceChange = (index, event) => {
    const { name, value } = event.target;
    const newPrices = [...prices];
    newPrices[index][name] = value;
    setPrices(newPrices);
  };
  const handlePriceName = () => {
    for (const i in prices) {
      prices[i].name = `${values.name} price ${(Number(i) + 1)}`
      prices[i].serviceId = 0;
      prices[i].priceNumber = Number(prices[i].priceNumber);
      prices[i].price = `$${prices[i].priceNumber}`
      prices[i].minWeight = Number(prices[i].minWeight);
      prices[i].maxWeight = Number(prices[i].maxWeight);
      prices[i].updatedAt = new Date().toISOString();
    }
  }
  const navigateToPageAndRefresh = (targetPage) => {
    // Navigate to the target page
    Router.push(targetPage);

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  const userSlice = useSelector((state) => state.user);
  const [createService, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_SERVICE, {
    client: new ApolloClient({
      uri: 'http://localhost:3000/graphql',
      cache: new InMemoryCache(),
    })
  })
  const handleAddService = async () => {
    handlePriceName()
    const body = {
      name: values.name,
      typeId: values.typeId,
      price: prices,
      description: values.description,
      timeServe: values.timeServe,
      selectedCount: 0,
    }


    try {
      const { data } = await createService({
        variables: { serviceType: body },

      });
      
      alert("Services created successfully");
      window.location.href = "/services";
    }
    catch (error) {
      console.error('Error create service:', error.message);
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
            {prices.map((price, index) => (
              <div key={index}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>

                      <Grid item md={4} xs={12}>
                        <TextField
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
            {
              prices.length > 1 &&
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
              </Box>}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" onClick={handleAddService}>
            Add Service
          </Button>
        </Box>
      </Card>
    </form >
  );
};

export default AddServiceForm;
