import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import CartListTable from "../../../components/order/edit/cart-list-table";
import OrderDetails from "../../../components/order/edit/order-details";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Page = ({ isEdit, id }) => {
  // const { order, shipping } = ordersData;
  const [isEdited, setIsEdited] = useState(isEdit === "true");
  const [orderData, setOrderData] = useState("");
  const userSlice = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`http://localhost:3333/order/${id}`, {
          headers: {
            Authorization: `Bearer ${userSlice.token}`,
          },
        })
        .then((res) => setOrderData(res.data))
        .catch((e) => console.log(e));
    };
    fetchData();
    return () => {};
  }, []);

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
          <CartListTable cart={orderData.order.cart} />
          <OrderDetails
            isEdited={isEdited}
            setIsEdited={setIsEdited}
            orderDetail={orderData.order}
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
