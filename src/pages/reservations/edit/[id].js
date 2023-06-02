import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import ReservationDetails from "../../../components/reservation/edit/reservation-details";
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useQuery, gql, ApolloClient, InMemoryCache } from '@apollo/client';

const GET_RESERVATIONS = gql`
query Reservation($reservationId: ID!) {
  reservation(id: $reservationId) {
    _id
    userId{
      id
    }
    userName
    phoneNumber
    species
    breed
    weight
    reservationDate
    reservationHour {
      timeFrame
      time
      slot
      name
      _id
    }
    serviceType {
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
    locationType
    location {
      region
      district
      ward
      address
      description
    }
    note
    status
    staffId {
      id
      firstName
      lastName
      email
      phone
      avatar {
        url
      }
    }
  }
  serviceTypes {
    _id
    name
    price {
      name
      price
      serviceId
      priceNumber
      minWeight
      maxWeight
    }
    description
    timeServe

  }
  staffs {
    id
    firstName
    lastName
    email
    phone
    avatar {
      id
      url
    }
  }
}
`

const Page = ({ isEdit, id }) => {
  // const { reservation, shipping } = reservationsData;
  const [isEdited, setIsEdited] = useState(isEdit === "true");
  const [reservationData, setReservationData] = useState("");
  const [serviceTypeData, setServiceTypeData] = useState("");
  const [staffData, setStaffData] = useState("");
  const userSlice = useSelector((state) => state.user);
  const client = new ApolloClient({
    uri: 'https://thesis-backend-production-99f6.up.railway.app/graphql',
    cache: new InMemoryCache(),
  });
  const { loading, error, data } = useQuery(GET_RESERVATIONS, {
    variables: { reservationId: id },
    context: {
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    },
  });

  useEffect(() => {
    if (data && data.reservation) {
      setReservationData(data.reservation);
    }
    if (data && data.serviceTypes) {
      setServiceTypeData(data.serviceTypes);
    }
    if (data && data.staffs) {
      setStaffData(data.staffs);
    }
  }, [data]);
  if (!reservationData) {
    return <h1>Loading...2</h1>;
  }

  return (
    <>
      <Head>
        <title>Reservation Edit</title>
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
            {isEdited ? "Edit reservation" : "View reservation"}
          </Typography>
          <ReservationDetails
            isEdited={isEdited}
            setIsEdited={setIsEdited}
            reservationDetail={reservationData}
            serviceTypeDetail={serviceTypeData}
            staffList={staffData}
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
      isEdit: isEdited,
      id,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
