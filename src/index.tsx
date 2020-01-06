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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzgzNDI1NTUsImlhdCI6MTU3ODM0MDc1NSwiaXNzIjoiNWUxMzkxOTNhOWE0OWY3YWRmZGJkYTkxIiwic3RpdGNoX2RhdGEiOnsiYXBwX2lkIjoiWXdBQUFBVjJZV3gxWlFCQUFBQUFBUGhrc0RQQnNvOU40cThkK3lSRERTN3R2ZHIyVWtmaVVOcW00VWdpWjBlcXZKMTlaMDVaS0xIMlJ0akVLTmswd0VPLytuN3pmTUFNeTFvME5HcTF2c2NJWlc1amNubHdkR1ZrWDNaaGJIVmxBQUVBIiwiYXV0aC9zb3VyY2VkX2J5X3Byb3ZpZGVyX2lkIjoiWXdBQUFBVjJZV3gxWlFCQUFBQUFBSXE5M09vaEprSTBNVkp2WjNadDZaSXd3MEJjYjN4ZEExd3Q1VU95cDdXT2NSbEVLSUpZQ0JYYXp3c2Y0RkRSRjRING10ZXJ6T0NlZWV0bjNTWVVSSEVJWlc1amNubHdkR1ZrWDNaaGJIVmxBQUVBIiwibW9uZ29kYi9jbG91ZC1hcGlLZXkiOiJjd0FBQUFWMllXeDFaUUJRQUFBQUFObmF0NGMvN0JZdXQ3Mm80VEZHQXpEQy9KOEdEcVU2R1pIaEZxWEhFMTRVSUE1NWJKRzJRa0NydmxhaCsvd1Fvb1QzaWZtN1R2akNnb2syOFJRdzVPOTBqOVhMZm5Xb0N0elhYbjdKMVp6ckNHVnVZM0o1Y0hSbFpGOTJZV3gxWlFBQkFBPT0iLCJtb25nb2RiL2Nsb3VkLXVzZXJuYW1lIjoiVXdBQUFBVjJZV3gxWlFBd0FBQUFBR0NRazBVRDhLdDlYZFg0bWdHQ1pqdzNtUXNIZDJFMXRRejloMUF6WVdXdXpkVW4vWCtKVkUycDI4NWk0YjRySlFobGJtTnllWEIwWldSZmRtRnNkV1VBQVFBPSJ9LCJzdGl0Y2hfZGV2SWQiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJzdGl0Y2hfZG9tYWluSWQiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJzdWIiOiI1ZDdhOGUxNjc5MzU4ZWMwZjMzNmU1OTMiLCJ0eXAiOiJhY2Nlc3MifQ.Vl8ZMUHof8I3VRC377PudvA__Clcopzwb14B8FhND48"

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
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
