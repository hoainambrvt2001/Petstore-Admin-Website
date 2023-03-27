import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import AddServiceForm from "../../../components/services/add/add-service-form";
const Page = ({ services }) => {
  console.log(services)
  return (
    <>
      <Head>
        <title>Service Add</title>
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
            Add Service
          </Typography>
          <AddServiceForm services={services} />
        </Container>
      </Box>
    </>
  );
};


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
