import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Pagination } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useSelector } from "react-redux";
import axios from "axios";
import ServiceListResults from "../../components/services/view/service-list-results";
import ServiceListToolbar from "../../components/services/view/service-list-toolbar";
import { gql, useQuery } from "@apollo/client";

const GET_SERVICE = gql`
query ServiceTypes {
  serviceTypes {
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
  }
}`
const Page = ({ searchText }) => {
  const [serviceData, setServiceData] = useState("");
  // const { data: services, total, page, last_page, minPrice, maxPrice } = serviceData;
  const userSlice = useSelector((state) => state.user);
  const { loading, error, data } = useQuery(GET_SERVICE, {
    uri: 'http://localhost:3000/graphql',
    headers: {
      Authorization: `Bearer ${userSlice.token}`,
    },
  });
  useEffect(() => {
    if (data && data.serviceTypes) {
      setServiceData(data.serviceTypes);
    }
  }, [data]);



  if (!serviceData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Services</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ServiceListToolbar />
          <Box sx={{ mt: 3 }}>
            <ServiceListResults services={serviceData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const { searchText = "" } = context.query;

  return {
    props: {
      searchText,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
