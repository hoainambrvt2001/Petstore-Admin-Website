import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Box, Button, Container, Link, TextField, Typography } from "@mui/material";
import { setUser } from "../store/reducers/userSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
const LOGIN_MUTATION = gql`
mutation Mutation($input: AuthInput!) {
  signIn(input: $input) {
    accessToken
    expiredIn
    user {
      id
      firstName
      lastName
      email
      role
    }
    statusCode
  }
}
`
const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginMutation, { loading: mutationLoading, error: mutationError }] = useMutation(LOGIN_MUTATION, {
    client: new ApolloClient({
      uri: 'http://localhost:3000/graphql',
      cache: new InMemoryCache(),
    })
  })
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const inputs = {
          email: values.email,
          password: values.password,
        }

        const { data } = await loginMutation({
          variables: { input: inputs },
        })

        const loginInData = data.signIn;
        if (loginInData) {
          const userInfo = {
            id: loginInData.user.id,
            username: loginInData.user.username,
            firstName: loginInData.user.firstName,
            lastName: loginInData.user.lastName,
            token: loginInData.accessToken,
          };
          Cookies.set("user", JSON.stringify(userInfo), { expires: loginInData.expiredIn });
          dispatch(setUser(userInfo));
          router.push(router.query.continueUrl ? `/${router.query.continueUrl}` : "/");
        }
      } catch (e) {
        console.log(e);
      }
      setSubmitting(false);
      resetForm();
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 2 }}>
              <Typography color="textPrimary" variant="h4">
                Sign in
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Sign in with email address
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body2">
              Don&apos;t have an account?{" "}
              <NextLink href="/register">
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
