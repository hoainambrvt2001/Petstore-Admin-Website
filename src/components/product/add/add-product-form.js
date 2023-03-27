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
import FileUploaderSingle from "./upload-images";
import DropzoneWrapper from "../styles";
import Router from "next/router";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
const CREATE_PRODUCT = gql`
mutation CreateProduct($product: CreateProductInput!, $files: [Upload!]) {
  createProduct(product: $product, files: $files) {
    name
    productCode
    productSKU
    description
    price
    shortDescription
    additionalInfo
    stock
    _id
  }
}
`
const AddProductForm = ({ categories }) => {
  console.log("cate", categories)
  const [values, setValues] = useState({
    name: "",
    productCode: "",
    categories: "",
    price: "",
    productSKU: "",
    description: "",
    shortDescription: "",
    additionalInfo: "",
  });
  console.log("values", values);
  const [images, setImages] = useState([]);
  console.log("img", images);
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const handleFileChange = (event) => {
    console.log("eve", event);
    setImages(event.target.files);
  }
  const link = createUploadLink({ uri: "http://localhost:3000/graphql" })
  const [createProduct, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_PRODUCT, {
    client: new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  })
  const handleAddProduct = async () => {
    const cates = [Buffer.from(values.categories)];
    const cateIds = cates.map(cate => cate.toString());
    const body = {
      name: values.name,
      productCode: values.productCode,
      productSKU: values.productSKU,
      categories: cateIds,
      price: Number(values.price),
      description: values.description,
      shortDescription: values.shortDescription,
      additionalInfos: values.additionalInfo,
    }
    console.log("body", body);
    try {
      const { data } = await createProduct({
        variables: {
          product: body,
          files: images,
        },
      })
      console.log("res", data.createProduct);
      Router.replace(`/products/`);
    } catch (error) {
      console.error('Error create product:', error.message);
    }

  };

  return (
    <form autoComplete="off" noValidate encType="multipart/form-data">
      <Card>
        <CardHeader title="Product Detail" />
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
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  name="categories"
                  labelId="category-select-label"
                  value={values.categories}
                  label="Category"
                  onChange={handleChange}
                >
                  {categories.map((cate) => {
                    return (
                      <MenuItem value={cate._id} key={cate._id}>
                        {cate.category_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                placeholder="Enter price"
                name="price"
                onChange={handleChange}
                value={values.price}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Code"
                placeholder="Enter code"
                name="productCode"
                onChange={handleChange}
                value={values.productCode}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="SKU"
                placeholder="Enter SKU"
                name="productSKU"
                onChange={handleChange}
                value={values.productSKU}
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
            <Grid item md={12} xs={12}>
              <TextField
                multiline
                minRows={5}
                fullWidth
                label="Short description"
                placeholder="Enter short description"
                name="shortDescription"
                onChange={handleChange}
                value={values.shortDescription}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                multiline
                minRows={5}
                fullWidth
                label="Additional Information"
                placeholder="Enter additional information"
                name="additionalInfo"
                onChange={handleChange}
                value={values.additionalInfo}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Images
              </Typography>
              <DropzoneWrapper>
                <FileUploaderSingle setImages={setImages} />
                {/* <input type="file" onChange={handleFileChange} /> */}
              </DropzoneWrapper>
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
          <Button color="primary" variant="contained" onClick={handleAddProduct}>
            Add product
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AddProductForm;
