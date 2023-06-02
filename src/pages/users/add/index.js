import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import AddStaffForm from "../../../components/staff/add/add-staff-form";
import axios from "axios";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";



export default function Page() {
  return (
    <>
      <Head>
        <title>Staff Add</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Add Staff
          </Typography>
          <AddStaffForm />
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;


