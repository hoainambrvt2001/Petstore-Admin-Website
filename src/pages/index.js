import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Grid } from "@mui/material";
import { TotalOrder } from "../components/dashboard/total-order";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { Sale } from "../components/dashboard/sale";
import { TotalSoldProduct } from "../components/dashboard/total-sold-product";
import { TotalPendingOrder } from "../components/dashboard/total-pending-order";
import { DashboardLayout } from "../components/dashboard-layout";
import axios from "axios";
import { useSelector } from "react-redux";
// import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
// import { LatestProducts } from "../components/dashboard/latest-products";
// import { Sales } from "../components/dashboard/sales";

const Page = () => {
  const userSlice = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:3333/admin/dashboard";
      const config = {
        headers: {
          Authorization: `Bearer ${userSlice.token}`,
        },
      };
      const data = await axios
        .get(url, config)
        .then((res) => res.data)
        .catch((e) => console.log(e));

      setDashboardData(data);
    };
    if (userSlice.token) fetchData();

    return () => {};
  }, [userSlice.token]);

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
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalOrder totalOrder={dashboardData.totalOrder} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalPendingOrder totalPendingOrder={dashboardData.totalPendingOrder} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalSoldProduct totalSoldProduct={dashboardData.totalSoldProduct} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <Sale totalSale={dashboardData.totalSale} />
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
              <LatestOrders orders={dashboardData.orders} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
