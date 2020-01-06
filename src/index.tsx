import * as React from "react";
import { render } from "react-dom";
import "./styles.css";

import gql from "graphql-tag";
import { HttpLink, InMemoryCache, ApolloLink } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context"

const REALM_GRAPHQL_URL =
  "https://stitch-dev.mongodb.com/api/admin/v3.0/groups/5dd58ffb7a3e5a6c5bce88da/apps/5dd81bbe751ac96d376b5284/graphql";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzgzNDExODYsImlhdCI6MTU3ODMzOTM4NiwiaXNzIjoiNWUxMzhjM2ExYjM4ZDM1ODQzMGVhYjE4Iiwic3RpdGNoX2RhdGEiOnsiYXBwX2lkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiYXV0aC9zb3VyY2VkX2J5X3Byb3ZpZGVyX2lkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwibW9uZ29kYi9jbG91ZC1hcGlLZXkiOiI0MmY1NGM4ZC1lYTRkLTQ2MGEtOGZjYy0wMzExMzZjYTNiZmUiLCJtb25nb2RiL2Nsb3VkLXVzZXJuYW1lIjoiQ0ZTRVBYU0oifSwic3RpdGNoX2RldklkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwic3RpdGNoX2RvbWFpbklkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwic3ViIjoiNWRmYzM4ZDI3YTNlNWEyOTY5OGM0ZDgwIiwidHlwIjoiYWNjZXNzIn0.vDx9bxec4pjPtA74Ko77Z6QyvMKGq9XNnZ2eU3H5l08"

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ... headers,
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
  }
})

const httpLink = new HttpLink({ uri: REALM_GRAPHQL_URL });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
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

  // Log anytime data or loading state changes
  React.useEffect(() => {
    console.log("data/loading change");
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

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root"),
);
