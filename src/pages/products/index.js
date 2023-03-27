import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Pagination } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import axios from "axios";
import ProductListToolbar from "../../components/product/view/product-list-toolbar";
import ProductListResults from "../../components/product/view/product-list-results";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

const SEARCH_PRODUCTS = gql`
query Products($filters: ProductFilter, $limit: Int) {
  products(filters: $filters, limit: $limit) {
    docs {
      _id
      name
      productCode
      productSKU
      price
      price
      images {
        url
        id
      }
      categories {
        category_name
        _id
      }
    }
  }
}`
const Page = ({ searchText }) => {
  const [productData, setProductData] = useState("");
  const userSlice = useSelector((state) => state.user);
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      limit: 100000,
      filters: {
        name: searchText
      }
    },
    context: {
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    },
  });
  useEffect(() => {
    if (data && data.products) {
      setProductData(data.products);
    }
  }, [data]);
  console.log("real", productData);

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
            <ProductListResults products={productData.docs} />
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
