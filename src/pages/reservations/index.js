import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import ReservationListToolbar from "../../components/reservation/view/reservation-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import ReservationListResults from "../../components/reservation/view/reservation-list-results";
import { useSelector } from "react-redux";
import { useQuery, gql } from '@apollo/client';

const GET_RESERVATIONS = gql`
query Reservations {
  reservations {
    _id
    userName
    phoneNumber
    species
    breed
    weight
    note
    status
    locationType
    serviceType {
      _id
      description
      name
      price {
        priceNumber
        maxWeight
        minWeight
      }
    }
    location {
      region
      district
      ward
      address
      description
    }
    reservationDate
    reservationHour {
      timeFrame
      time
      slot
      _id
      name
    }
    userId {
      id
    }
  }
}
`
const Page = () => {
  const [reservationData, setReservationData] = useState("");
  const userSlice = useSelector((state) => state.user);

  const { loading, error, data } = useQuery(GET_RESERVATIONS, {
    uri: 'http://localhost:3000/graphql',
    headers: {
      Authorization: `Bearer ${userSlice.token}`,
    },
  });
  useEffect(() => {
    if (data && data.reservations) {
      setReservationData(data.reservations);
    }
  }, [data]);
  if (!reservationData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Reservations</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ReservationListToolbar />
          <Box sx={{ mt: 3 }}>
            <ReservationListResults
              reservations={reservationData}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
