import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import axios from "axios";
import ProductDetails from "../../../components/product/edit/product-details";
import { useSelector } from "react-redux";

const Page = ({ productId, isEdit }) => {
  const [isEdited, setIsEdited] = useState(isEdit === "true");
  const [productData, setProductData] = useState("");
  const userSlice = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`http://localhost:3333/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${userSlice.token}`,
          },
        })
        .then((res) => setProductData(res.data.productDetail))
        .catch((e) => console.log(e));
    };
    fetchData();
    return () => {};
  }, []);

  if (!productData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Product Edit</title>
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
            {isEdited ? "Edit product" : "View product"}
          </Typography>
          <ProductDetails
            isEdited={isEdited}
            productDetail={productData}
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
      productId: id,
      isEdit: isEdited,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
