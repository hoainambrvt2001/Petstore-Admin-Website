import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import CartListTable from "../../../components/order/edit/cart-list-table";
import OrderDetails from "../../../components/order/edit/order-details";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

const GET_ORDER = gql`
query Order($orderId: ID!) {
  order(id: $orderId) {
    _id
    bill {
      firstName
      lastName
      phone
      email
      company
      region
      district
      ward
      address
      paymentMethod
    }
    cart {
      name
      price
      quantity
      id
      images {
        _id
        image_name
        url
      }
    }
    totalPrice
    shippingFee
    status
  }
}`

const Page = ({ isEdit, id }) => {
  // const { order, shipping } = ordersData;
  const [isEdited, setIsEdited] = useState(isEdit === "true");
  const [orderData, setOrderData] = useState("");
  const userSlice = useSelector((state) => state.user);

  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });
  const { loading, error, data } = useQuery(GET_ORDER, {
    variables: { orderId: id },
    context: {
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    },
  });
  useEffect(() => {
    if (data && data.order) {
      setOrderData(data.order);
    }
  }, [data]);
  console.log("orderData", orderData);
  if (!orderData) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Head>
        <title>Order Edit</title>
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
            {isEdited ? "Edit order" : "View order"}
          </Typography>
          <CartListTable cart={orderData.cart} />
          <OrderDetails
            isEdited={isEdited}
            setIsEdited={setIsEdited}
            orderDetail={orderData}
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
