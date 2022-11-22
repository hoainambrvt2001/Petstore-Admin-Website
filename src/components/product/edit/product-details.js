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
} from "@mui/material";
import FileUploaderSingle from "./upload-images";
import DropzoneWrapper from "../styles/index";

const ProductDetails = ({ isEdited, setIsEdited, productDetail }) => {
  const [values, setValues] = useState({
    name: productDetail.name,
    code: productDetail.productCode,
    categories: productDetail.categories,
    price: productDetail.price,
    productSKU: productDetail.productSKU,
    description: productDetail.description,
    shortDescription: productDetail.shortDescription,
    additionalInfo: productDetail.additionalInfo,
    images: productDetail.images,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveChanges = () => {
    console.log(values);
  };

  const handleSwapMode = () => {
    setIsEdited(!isEdited);
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        <CardHeader title="Product Detail" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="Name"
                name="name"
                onChange={handleChange}
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                  startAdornment: <Typography>$</Typography>,
                }}
                fullWidth
                label="Price"
                name="price"
                onChange={handleChange}
                value={values.price}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="Code"
                name="code"
                onChange={handleChange}
                value={values.code}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isEdited,
                }}
                fullWidth
                label="SKU"
                name="productSKU"
                onChange={handleChange}
                value={values.productSKU}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Description
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{ __html: values.description }}
                sx={{ border: "1px solid #E6E8F0", borderRadius: "8px", padding: "15px 30px" }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Short Description
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{ __html: values.shortDescription }}
                sx={{ border: "1px solid #E6E8F0", borderRadius: "8px", padding: "15px 30px" }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Additional Info
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{ __html: values.additionalInfo }}
                sx={{
                  border: "1px solid #E6E8F0",
                  borderRadius: "8px",
                  padding: "15px 30px",
                  minHeight: "50px",
                }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Images
              </Typography>
              <DropzoneWrapper>
                <FileUploaderSingle
                  image={{
                    name: values.images.length !== 0 ? values.images[0].image_name : "no image",
                    url:
                      values.images.length !== 0
                        ? values.images[0].url
                        : "/static/images/no-image.png",
                  }}
                  isEdited={isEdited}
                  isHaveImage={values.images.length !== 0}
                />
              </DropzoneWrapper>
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

export default ProductDetails;
