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
import axios from "axios";
import Router from "next/router";

const AddProductForm = ({ categories }) => {
  const [values, setValues] = useState({
    name: "",
    productCode: "",
    categories: "",
    price: "",
    productSKU: "",
    description: "",
    shortDescription: "",
    additionalInfo: "",
    // images: [],
  });
  const [images, setImages] = useState([]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddProduct = async () => {
    // console.log({ ...values, images: images[0] });
    const url = "http://localhost:3333/product/create";
    const formBody = new FormData();
    formBody.append("name", values.name);
    formBody.append("productCode", values.productCode);
    formBody.append("categories", values.categories);
    formBody.append("price", values.price);
    formBody.append("productSKU", values.productSKU);
    formBody.append("description", values.description);
    formBody.append("shortDescription", values.shortDescription);
    formBody.append("images", images);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios
      .post(url, formBody, config)
      .then((res) => res.data)
      .catch((e) => console.log(e));
    Router.replace(`/products/edit/${response._id}?isEdited=false`);
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
