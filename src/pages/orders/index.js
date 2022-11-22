import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import OrderListToolbar from "../../components/order/view/order-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import axios from "axios";
import OrderListResults from "../../components/order/view/order-list-results";
import { useSelector } from "react-redux";

const Page = () => {
  const [orderData, setOrderData] = useState("");
  const userSlice = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("http://localhost:3333/order/admin", {
          headers: {
            Authorization: `Bearer ${userSlice.token}`,
          },
        })
        .then((res) => setOrderData(res.data));
    };
    fetchData();

    return () => {};
  }, []);

  if (!orderData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <OrderListToolbar />
          <Box sx={{ mt: 3 }}>
            <OrderListResults orders={orderData.orders} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
