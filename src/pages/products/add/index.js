import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import AddProductForm from "../../../components/product/add/add-product-form";
import axios from "axios";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

const GET_CATEGORIES = gql`
  query Categories {
    categories {
      _id
      category_name
      totalProducts
    }
  }
`;

export default function Page({ categories }) {
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
}

export async function getServerSideProps(context) {
  const client = new ApolloClient({
    uri: 'https://thesis-backend-production-99f6.up.railway.app/graphql',
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: GET_CATEGORIES,
  });

  const categories = data.categories;

  return {
    props: {
      categories,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

