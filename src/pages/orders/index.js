import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import OrderListToolbar from "../../components/order/view/order-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import axios from "axios";
import OrderListResults from "../../components/order/view/order-list-results";
import { useSelector } from "react-redux";
import { useQuery, gql } from '@apollo/client';

const GET_ORDERS = gql`
query Orders($limit: Int) {
  orders(limit: $limit) {
    docs {
      id
      totalPrice
      status
      createdAt
      bill {
        firstName
        lastName
        paymentMethod
        address
        ward
        district
        region
      }
    }
  }
}
`
const Page = () => {
  const [orderData, setOrderData] = useState("");
  const userSlice = useSelector((state) => state.user);

  const { loading, error, data } = useQuery(GET_ORDERS, {

    uri: 'http://localhost:3000/graphql',
    headers: {
      Authorization: `Bearer ${userSlice.token}`,
    },
    variables: {
      limit: 100000,
    }
  });
  useEffect(() => {
    if (data && data.orders) {
      setOrderData(data.orders);
    }
  }, [data]);

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
            <OrderListResults orders={orderData.docs} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
