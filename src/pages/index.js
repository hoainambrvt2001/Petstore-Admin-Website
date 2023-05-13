import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Grid } from "@mui/material";
import { TotalOrder } from "../components/dashboard/total-order";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { Sale } from "../components/dashboard/sale";
import { TotalSoldProduct } from "../components/dashboard/total-sold-product";
import { TotalPendingOrder } from "../components/dashboard/total-pending-order";
import { DashboardLayout } from "../components/dashboard-layout";
import { TodayReservation } from "../components/dashboard/today-reservation";
import axios from "axios";
import { useSelector } from "react-redux";
import { gql, useQuery } from "@apollo/client";
const GET_DASHBOARD = gql`
query Dashboard {
  totalReservationSales {
    totalSales
  }
  totalOrderandSales {
    totalOrder
    totalSales
    totalFinishedOrder
    totalPendingOrder
  }
  latestOrders {
    id
    bill {
      firstName
      lastName
    }
    createdAt
    status
  }
  todayReservations {
    _id
    userName
    phoneNumber
    species
    breed
    weight
    reservationHour {
      timeFrame
    }
    serviceType {
      name
      price {
        priceNumber
        minWeight
        maxWeight
      }
    }
    location {
      region
      district
      ward
      address
      description
    }
    status
    userId {
      id
    }
  }
}`

const Page = () => {
  const userSlice = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState("");
  if (userSlice.token) {
    const { loading, error, data } = useQuery(GET_DASHBOARD, {
      uri: 'http://localhost:3000/graphql',
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    });
    useEffect(() => {
      if (data) {
        setDashboardData(data);
      }
    }, [data]);
  }
  if (!dashboardData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={3} xl={6} xs={12}>
              <TotalOrder totalOrder={dashboardData.totalOrderandSales.totalOrder} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalPendingOrder totalPendingOrder={dashboardData.totalOrderandSales.totalPendingOrder} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <Sale text="Product Sale" totalSale={dashboardData.totalOrderandSales.totalSales} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <Sale text="Service Sale" totalSale={dashboardData.totalReservationSales.totalSales} />
            </Grid>
            {/* <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: "100%" }} />
          </Grid> */}
            <Grid item xs={12}>
              <TodayReservation reservations={dashboardData.todayReservations} />
            </Grid>
            <Grid item xs={12}>
              <LatestOrders orders={dashboardData.latestOrders} />
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
