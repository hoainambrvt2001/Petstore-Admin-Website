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
  IconButton, InputAdornment,
} from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import FileUploaderSingle from "./upload-images";
import DropzoneWrapper from "../styles";
import Router from "next/router";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
const CREATE_STAFF = gql`
mutation CreateStaff($data: StaffInput, $files: [Upload]) {
  createStaff(data: $data, files: $files) {
    id
    firstName
    lastName
    email
    role
    avatar {
      id
      url
      image_name
    }
  }
}
`
const AddStaffForm = ({ }) => {

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [images, setImages] = useState(null);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });

    validatePasswords(event.target.name, event.target.value);
  };
  const validatePasswords = (fieldName, fieldValue) => {
    if ((fieldName === 'confirmPassword' || fieldName === 'password') && fieldValue !== values.password) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };
  const link = createUploadLink({ uri: "http://localhost:3000/graphql" })
  const [createStaff, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_STAFF, {
    client: new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  })
  const handleAddStaff = async () => {
    const body = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    }
    if (values.password === values.confirmPassword && values.firstName && values.lastName && values.email && values.phone && values.password) {
      try {
        console.log("images", images);
        const { data } = await createStaff({
          variables: {
            data: body,
            files: images,
          },
        })

        alert("Staff created successfully");
        window.location.href = "/staffs";
      } catch (error) {
        console.error('Error create staff:', error.message);
      }
    }
    else {
      alert("Error");
    }

  };

  return (
    <form autoComplete="off" noValidate encType="multipart/form-data">
      <Card>
        <CardHeader title="Staff Detail" />
        <Divider />
        <CardContent>

          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Images
              </Typography>
              <DropzoneWrapper>
                <FileUploaderSingle setImages={setImages} />
              </DropzoneWrapper>
            </Grid>

            <Grid item md={8} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    placeholder="Enter First name"
                    name="firstName"
                    onChange={handleChange}
                    value={values.firstName}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    placeholder="Enter Last name"
                    name="lastName"
                    onChange={handleChange}
                    value={values.lastName}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="Enter Phone number"
                    name="phone"
                    onChange={handleChange}
                    value={values.phone}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={handleChange}
                    value={values.confirmPassword}
                    variant="outlined"
                    error={passwordError}
                    helperText={passwordError ? 'Password is not match' : ''}
                    required
                  />
                </Grid>
              </Grid>
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
          <Button color="primary" variant="contained" onClick={handleAddStaff}>
            Add staff
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AddStaffForm;
