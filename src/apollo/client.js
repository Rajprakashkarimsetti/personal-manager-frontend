// src/apollo/client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://zeroth-francisca-rajprakash-a3d9f427.koyeb.app/graphql/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

export default client;
