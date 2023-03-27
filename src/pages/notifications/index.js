import Head from "next/head";
import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import NotificationListToolbar from "../../components/notification/view/notification-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import axios from "axios";
import NotificationListResults from "../../components/notification/view/notification-list-results";
import { useSelector } from "react-redux";
import { useQuery, gql } from '@apollo/client';

const GET_NOTIFICATIONS = gql`
query Notifications {
  notifications {
    _id
    title
    orderId
    type
    reservation {
      _id
    }
    order {
      _id
    }
    isRead
    createdAt
  }
}
`
const Page = () => {
  const [notificationData, setNotificationData] = useState("");
  const userSlice = useSelector((state) => state.user);

  const { loading, error, data } = useQuery(GET_NOTIFICATIONS, {
    uri: 'http://localhost:3000/graphql',
    headers: {
      Authorization: `Bearer ${userSlice.token}`,
    },
  });
  useEffect(() => {
    if (data && data.notifications) {
      setNotificationData(data.notifications);
    }
  }, [data]);
  console.log("notificationData", notificationData);
  if (!notificationData) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <Head>
        <title>Notifications</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <NotificationListToolbar />
          <Box sx={{ mt: 3 }}>
            <NotificationListResults notifications={notificationData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
