import Head from "next/head";
import { Provider } from "react-redux";
import store from "../store";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { registerChartJs } from "../utils/register-chart-js";
import { theme } from "../theme";
import { UserProvider } from "../contexts/user-context";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

registerChartJs();

const clientSideEmotionCache = createEmotionCache();
const client = new ApolloClient({
  uri: 'https://thesis-backend-production-99f6.up.railway.app/graphql',
  cache: new InMemoryCache()
});

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Material Kit Pro</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
              <ApolloProvider client={client}>
                {getLayout(<Component {...pageProps} />)}
              </ApolloProvider>
            </UserProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </Provider>
    </CacheProvider>
  );
};

export default App;
