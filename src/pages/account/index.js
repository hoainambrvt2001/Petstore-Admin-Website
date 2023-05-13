import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Pagination, Typography } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useSelector } from "react-redux";


import { gql, useQuery } from "@apollo/client";
import AccountDetails from "../../components/account/account-details";
const GET_ACCOUNT = gql`
query GetAccount {
  getAccount {
    id
    firstName
    lastName
    email
    phone
    avatar {
      id
      url
    }
  }
}`
const Page = () => {
  const [accountData, setAccountData] = useState("");
  const userSlice = useSelector((state) => state.user);
  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    uri: 'http://localhost:3000/graphql',
    context: {
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    },
  });
  useEffect(() => {
    if (data && data.getAccount) {
      setAccountData(data.getAccount);
    }
  }, [data]);

  console.log(accountData);

  if (!accountData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <AccountDetails accountDetail={accountData} />

        </Container>
      </Box>
    </>
  );
};


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
