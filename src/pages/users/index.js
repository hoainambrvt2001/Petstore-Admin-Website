import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Pagination } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import axios from "axios";
import StaffListToolbar from "../../components/user/view/staff-list-toolbar";
import StaffListResults from "../../components/user/view/staff-list-results";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

const SEARCH_STAFF = gql`
query Users {
  users {
    id
    firstName
    email
    lastName
    role
    phone
    avatar {
      id
      url
    }
  }
}`
const Page = ({ searchText }) => {
  const [staffData, setStaffData] = useState("");
  const userSlice = useSelector((state) => state.user);
  const client = new ApolloClient({
    uri: 'https://thesis-backend-production-99f6.up.railway.app/graphql',
    cache: new InMemoryCache(),
  });
  const { loading, error, data } = useQuery(SEARCH_STAFF, {});
  useEffect(() => {
    if (data && data.users) {

      setStaffData(data.users);
      console.log("data", staffData.length);
    }
  }, [data]);


  if (!staffData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Staffs</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          {userSlice.role === 'ADMIN' && <StaffListToolbar />}
          <Box sx={{ mt: 3 }}>
            <StaffListResults staffs={staffData} role={userSlice.role} />
          </Box>
        </Container>
      </Box >
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
