import React from 'react'
import { Subscription, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import './style.css'
import Layout from '../Layout'

const GOSSIP = gql`
  subscription {
    gossip {
      type
      peer {
        host
        port
        client
      }
    }
  }
`

const REPLICATION = gql`
  subscription {
    replication {
      rate
      progress
      total
    }
  }
`

const PROCESS = gql`
  mutation($chunkSize: Int!) {
    process(chunkSize: $chunkSize) {
      chunkSize
      latestSequence
    }
  }
`

function App() {
  return (
    <div className="App">
      <Subscription subscription={GOSSIP}>
        {({ data: gossipData, loading: gossipLoading, error: gossipError }) => (
          <Subscription subscription={REPLICATION}>
            {({ data: replicationData, loading: replicationLoading, error: replicationError }) => (
              <Mutation
                mutation={PROCESS}
                // update={(cache, { data: { addTodo } }) => {
                //   const { todos } = cache.readQuery({ query: GET_TODOS });
                //   cache.writeQuery({
                //     query: GET_TODOS,
                //     data: { todos: todos.concat([addTodo]) },
                //   });
                // }}          
              >
                {(process, { data: indexingData, loading: indexingLoading, error: indexingError }) => {
                  const gossip = gossipData ? gossipData.gossip : (gossipLoading ? 'loading' : gossipError)
                  const replication = replicationData ? replicationData.replication : (replicationLoading ? 'loading' : replicationError)
                  // const indexing = indexingData ? indexingData.process : (indexingLoading ? 'loading' : indexingError)
                  return <Layout gossip={gossip} replication={replication} process={process} />
                }}
              </Mutation>
            )}
          </Subscription>
        )}
      </Subscription>
    </div>
  )
}

export default App
