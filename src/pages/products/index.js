import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Pagination } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import axios from "axios";
import ProductListToolbar from "../../components/product/view/product-list-toolbar";
import ProductListResults from "../../components/product/view/product-list-results";

const Page = ({ searchText }) => {
  const [productData, setProductData] = useState("");
  // const { data: products, total, page, last_page, minPrice, maxPrice } = productData;

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:3333/product?page=1&limit=99999999";
      const productData = await axios
        .get(url)
        .then((res) => res.data)
        .catch((e) => console.log(e));
      setProductData(productData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:3333/product/search?s=${searchText}`;
      const productData = await axios
        .get(url)
        .then((res) => res.data)
        .catch((e) => console.log(e));
      setProductData(productData);
    };
    fetchData();
  }, [searchText]);

  if (!productData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar />
          <Box sx={{ mt: 3 }}>
            <ProductListResults products={productData.data} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const { searchText = "" } = context.query;

  return {
    props: {
      searchText,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
