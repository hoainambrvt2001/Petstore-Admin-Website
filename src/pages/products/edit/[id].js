import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import axios from "axios";
import ProductDetails from "../../../components/product/edit/product-details";
import { useSelector } from "react-redux";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
const PRODUCT_DETAILS = gql`
query Query($productDetailId: ID!) {
  productDetail(id: $productDetailId) {
    _id
    name
    productCode
    productSKU
    description
    price
    shortDescription
    additionalInfos
    stock
    categories {
      _id
      category_name
      totalProducts
    }
    images {
      id
      url
      image_name
    }
  }
}
`
const Page = ({ productId, isEdit }) => {
  const [isEdited, setIsEdited] = useState(isEdit === "true");
  const [productData, setProductData] = useState("");
  const userSlice = useSelector((state) => state.user);

  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });
  const { loading, error, data } = useQuery(PRODUCT_DETAILS, {
    variables: {
      productDetailId: productId
    },
    context: {
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    },
  });
  useEffect(() => {
    if (data && data.productDetail) {
      setProductData(data.productDetail);
    }
  }, [data]);
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
