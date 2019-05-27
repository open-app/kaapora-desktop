import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/core/styles'
import useWindowScrollPosition from '@rehooks/window-scroll-position'
import CircularProgress from '@material-ui/core/CircularProgress';
import Media from '../Media'

const options = {
  throttle: 100,
}

const THREADS = gql`
  query($after: String $before: String $first: Int) {
    threads(after: $after before: $before first: $first) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          replies {
            id
            author {
              name
              imageLink
            }
            text
            assertedTimestamp
          }
          root {
            id
            author {
              id
              name
              imageLink
            }
            text
            likesCount
            likes {
              author {
                id
                name
              }
              value
            }
            receivedTimestamp
            assertedTimestamp
            forks {
              author {
                id
                name
              }
              text
              rootKey
            }
          }
        }
      }
    }
  }
`

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexFlow: 'column',
  },
  paper: {
    padding: theme.spacing(2),
    margin: '15px auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
})

function List({ data, fetchMore, updateList, mediaList, loading, toggleLoading }) {
  let position = useWindowScrollPosition(options)
  React.useEffect(() => {
    if (Object.entries(mediaList).length === 0 && mediaList.constructor === Object) {
      updateList(data)
    }
    const hasNextPage = mediaList.pageInfo ? mediaList.pageInfo.hasNextPage : false
    if (hasNextPage && !loading && (position.y > 100) && (position.y > document.documentElement.offsetHeight-window.innerHeight - 30)) {
      toggleLoading(true)
      fetchMore({
        variables: { before: mediaList.pageInfo.endCursor || data.pageInfo.endCursor, },
        updateQuery: (prev, { fetchMoreResult }) => {
          toggleLoading(false)
          if (!fetchMoreResult) return prev
          const newList = {
            edges: mediaList.edges.concat(fetchMoreResult.threads.edges),
            pageInfo: fetchMoreResult.threads.pageInfo
          }
          return updateList(newList)
        } 
      })
    }
  })
  if (mediaList.edges) {
    return <div>
      {mediaList.edges.map(media => <Media key={media.node.root.id} {...media.node.root} replies={media.node.replies} />)}
      {loading && <CircularProgress />}
    </div>
  } else return <CircularProgress />
}

function MediaList({ hidden, classes }) {
  const [mediaList, updateList] = React.useState({})
  const [loading, updateLoading] = React.useState(null)
  function toggleLoading(value) {
    return updateLoading(value)
  }

  return (
    <Query query={THREADS} variables={{ first: 3 }}>
      {({ data: threadsData, loading: threadsLoading, error: threadsError, fetchMore }) => (
        <div style={{ display: hidden ? 'none' : 'block' }}>
          {(threadsData && threadsData.threads) && <List
            fetchMore={fetchMore}
            data={threadsData.threads}
            updateList={updateList}
            mediaList={mediaList}
            loading={loading}
            toggleLoading={toggleLoading}
          />}
        </div>
      )}
    </Query>
  )
}

MediaList.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MediaList)
