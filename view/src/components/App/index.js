import React from 'react'
import { Subscription } from 'react-apollo'
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

function App() {
  return (
    <div className="App">
      <Subscription subscription={GOSSIP}>
        {({ data: gossipData, loading: gossipLoading, error: gossipError }) => (
          <Subscription subscription={REPLICATION}>
            {({ data: replicationData, loading: replicationLoading, error: replicationError }) => {
              const gossip = gossipData ? gossipData.gossip : (gossipLoading ? 'loading' : gossipError)
              const replication = replicationData ? replicationData.replication : (replicationLoading ? 'loading' : replicationError)
              return <Layout gossip={gossip} replication={replication} />
            }}
          </Subscription>
        )}
      </Subscription>
    </div>
  )
}

export default App
