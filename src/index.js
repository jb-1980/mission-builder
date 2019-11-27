import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { UserProvider } from "./contexts/user-context"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"
import { DndProvider } from "react-dnd"
import { DataProvider } from "./contexts/data-context"
import HTML5Backend from "react-dnd-html5-backend"

const { protocol, hostname, port } = window.location
const client = new ApolloClient({
  uri: `${protocol}//${hostname}:${port}/graphql`,
  resolvers: {},
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <UserProvider>
      <DataProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </DataProvider>
    </UserProvider>
  </ApolloProvider>,
  document.getElementById("root")
)
