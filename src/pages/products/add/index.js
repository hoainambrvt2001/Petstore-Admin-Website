import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import AddProductForm from "../../../components/product/add/add-product-form";
import axios from "axios";

const Page = ({ categories }) => {
  return (
    <>
      <Head>
        <title>Product Add</title>
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
            Add Product
          </Typography>
          <AddProductForm categories={categories} />
        </Container>
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const categories = await axios
    .get("http://localhost:3333/categories")
    .then((res) => res.data)
    .catch((e) => console.log(e));

  return {
    props: {
      categories,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
