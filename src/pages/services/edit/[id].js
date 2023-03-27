import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import axios from "axios";
import ServiceDetails from "../../../components/services/edit/service-details";
import { useSelector } from "react-redux";
import { gql, useQuery } from "@apollo/client";

const GET_SERVICE = gql`
query ServiceType($serviceTypeId: ID!) {
  serviceType(id: $serviceTypeId) {
    _id
    name
    price {
      name
      serviceId
      price
      priceNumber
      minWeight
      updatedAt
      maxWeight
    }
    selectedCount
    description
    timeServe
    typeId
  }
}
`

const Page = ({ serviceId, isEdit }) => {
  const [isEdited, setIsEdited] = useState(isEdit === "true");
  const [serviceData, setServiceData] = useState("");
  const userSlice = useSelector((state) => state.user);

  const { loading, error, data } = useQuery(GET_SERVICE, {
    variables: { serviceTypeId: serviceId },
    uri: 'http://localhost:3000/graphql',
    headers: {
      Authorization: `Bearer ${userSlice.token}`,
    },
  });

  useEffect(() => {
    if (data && data.serviceType) {
      setServiceData(data.serviceType);
    }
  }, [data]);
  console.log(serviceData);
  if (!serviceData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Service Edit</title>
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
            {isEdited ? "Edit service" : "View service"}
          </Typography>
          <ServiceDetails
            isEdited={isEdited}
            serviceDetail={serviceData}
            setIsEdited={setIsEdited}
          />
        </Container>
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const { isEdited, id } = context.query;
  return {
    props: {
      serviceId: id,
      isEdit: isEdited,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
