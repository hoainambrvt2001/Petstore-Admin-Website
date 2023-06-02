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
import DropzoneWrapper from "./styles/index";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const UPDATE_STAFF = gql`
mutation UpdateUser($updateUserId: ID!, $input: StaffInput, $files: [Upload]) {
  updateUser(id: $updateUserId, input: $input, files: $files) {
    id
  }
}`
const AccountDetails = ({ isEdited, setIsEdited, accountDetail }) => {
  const [values, setValues] = useState({
    firstName: accountDetail.firstName,
    lastName: accountDetail.lastName,
    email: accountDetail.email,
    phone: accountDetail.phone ? accountDetail.phone : "",
    avatar: accountDetail.avatar,
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [images, setImages] = useState(null);

  const link = createUploadLink({ uri: "https://thesis-backend-production-99f6.up.railway.app/graphql" })
  const [updateStaff, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_STAFF, {
    client: new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  })
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

  const handleSaveChanges = async () => {
    const body = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
    }
    if (values.password) body = { ...body, password: values.password }
    try {

      const { data } = await updateStaff({
        variables: {
          updateUserId: accountDetail.id,
          input: body,
          files: images ? images : [],
        },
      })




      window.location.href = "/";
    } catch (error) {
      console.error('Error update staff:', error.message);
    }
  };

  const handleSwapMode = () => {
    setIsEdited(!isEdited);
  };

  return (

    <form autoComplete="off" noValidate encType="multipart/form-data">
      <Card>
        <CardHeader title="Account Detail" />
        <Divider />
        <CardContent>

          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Typography variant="body2" color="#65748B" sx={{ mb: 1 }}>
                Images
              </Typography>
              <DropzoneWrapper>
                <FileUploaderSingle
                  image={{
                    name: values.avatar ? values.avatar.image_name : "no image",
                    url: values.avatar
                      ? values.avatar.url
                      : "/static/images/no-image.png"
                  }}
                  isHaveImage={values.avatar ? true : false}
                  setImages={setImages}
                  isEdited={true} />

              </DropzoneWrapper>
            </Grid>

            <Grid item md={6} xs={12}>
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
                {changePassword && <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                  }}
                >
                  <Button color="primary" variant="contained" onClick={() => setChangePassword(!changePassword)}>
                    Change Password
                  </Button>
                </Box>}
                {!changePassword && <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter New Password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                    variant="outlined"
                    required
                  />
                </Grid>
                }
                {!changePassword &&
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
                  </Grid>}

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
          <Button color="primary" variant="contained" onClick={handleSaveChanges}>
            Update account
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AccountDetails;
