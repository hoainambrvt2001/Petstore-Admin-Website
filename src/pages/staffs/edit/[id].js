import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import axios from "axios";
import StaffDetails from "../../../components/staff/edit/staff-details";
import { useSelector } from "react-redux";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
const STAFF_DETAILS = gql`
query Query($userId: ID!) {
  user(id: $userId) {
    id
    firstName
    email
    lastName
    phone
    avatar {
      id
      url
      image_name
    }

  }
}
`
const Page = ({ staffId, isEdit }) => {
  const [isEdited, setIsEdited] = useState(isEdit === "true");
  const [staffData, setStaffData] = useState("");
  const userSlice = useSelector((state) => state.user);
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });
  const { loading, error, data } = useQuery(STAFF_DETAILS, {
    variables: {
      userId: staffId
    },
    context: {
      headers: {
        Authorization: `Bearer ${userSlice.token}`,
      },
    },
  });
  useEffect(() => {
    console.log("data", data);
    if (data && data.user) {
      setStaffData(data.user);
    }
  }, [data]);
  if (!staffData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Staff Edit</title>
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
            {isEdited ? "Edit staff" : "View staff"}
          </Typography>
          <StaffDetails
            isEdited={isEdited}
            staffDetail={staffData}
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
      staffId: id,
      isEdit: isEdited,
    },
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
