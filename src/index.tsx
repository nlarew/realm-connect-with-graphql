import { render } from "react-dom";

import "./styles.css";

// import { AppRegistry } from 'react-native';
// AppRegistry.registerComponent("MyApplication", () => App);

import * as React from "react";
import gql from "graphql-tag";
import { HttpLink, InMemoryCache, ApolloLink } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";

import getAccessToken from "./getAccessToken";

getAccessToken("stitch-dev")
  .then(result => console.log("woohoOoo"))
  .catch(err => console.error("fack", err));

const REALM_GRAPHQL_URL =
  "https://stitch-dev.mongodb.com/api/admin/v3.0/groups/5dd58ffb7a3e5a6c5bce88da/apps/5dd81bbe751ac96d376b5284/graphql";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MTUxMTYsImlhdCI6MTU3NjgxMzMxNiwiaXNzIjoiNWRmYzQzMDQ2MmIzNjJmMzg3NmQ5Yjg5Iiwic3RpdGNoX2RhdGEiOnsiYXBwX2lkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiYXV0aC9zb3VyY2VkX2J5X3Byb3ZpZGVyX2lkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwibW9uZ29kYi9jbG91ZC1hcGlLZXkiOiI0MmY1NGM4ZC1lYTRkLTQ2MGEtOGZjYy0wMzExMzZjYTNiZmUiLCJtb25nb2RiL2Nsb3VkLXVzZXJuYW1lIjoiQ0ZTRVBYU0oifSwic3RpdGNoX2RldklkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwic3RpdGNoX2RvbWFpbklkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwic3ViIjoiNWRmYzM4ZDI3YTNlNWEyOTY5OGM0ZDgwIiwidHlwIjoiYWNjZXNzIn0.vTJNcA4mi_BqI033ab1sUBQ1Eggi8NX5emfaL1ymXQ8";

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      FooBar: "MyFaceWhen",
    },
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: REALM_GRAPHQL_URL,
  // credentials: "same-origin",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const GET_ALL_MOVIES = gql`
  query AllMovies {
    movies {
      title
      year
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_ALL_MOVIES);

  React.useEffect(() => {
    console.log("loading", loading);
    console.log("data", data);
  }, [data, loading]);

  return (
    <div className="App">
      <div>{loading ? "loading" : "not loading"}</div>
      <div>{error && `error: ${error}`}</div>
      <div>
        {data !== undefined ? "data exists! :D" : "data is undefined :("}
      </div>
    </div>
  );
}
console.log("client", client);
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root"),
);
