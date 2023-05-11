import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Pagination } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import axios from "axios";
import StaffListToolbar from "../../components/staff/view/staff-list-toolbar";
import StaffListResults from "../../components/staff/view/staff-list-results";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

const SEARCH_STAFF = gql`
query Query {
  staffs {
    firstName
    lastName
    email
    id
    avatar {
      url
      id
    }
  }
}`
const Page = ({ searchText }) => {
  const [staffData, setStaffData] = useState("");
  const userSlice = useSelector((state) => state.user);
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });
  const { loading, error, data } = useQuery(SEARCH_STAFF, {});
  useEffect(() => {
    if (data && data.staffs) {

      setStaffData(data.staffs);
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
          <StaffListToolbar />
          <Box sx={{ mt: 3 }}>
            <StaffListResults staffs={staffData} />
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
