import React from 'react'
import useInterval from '@use-hooks/interval';
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/core/styles'
import useWindowScrollPosition from '@rehooks/window-scroll-position'
import CircularProgress from '@material-ui/core/CircularProgress'
import Media from '../Media'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CreatePost from '../CreatePost'
import mergeArrays from '../../utils/mergeArrays'

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
            likesCount
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

const options = {
  throttle: 100,
}

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
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
})


function List({ data,
  fetchMore,
  updateList,
  mediaList,
  loading,
  toggleLoading,
  indexing,
  refetch,
  updateIncommingList,
  incommingList
}) {
  useInterval(() => {
    if (indexing.loading) {
      refetch()
      .then(i => {
        const newList = {
          pageInfo: i.data.threads.pageInfo,
          edges: incommingList.edges
            ? mergeArrays(incommingList.edges, i.data.threads.edges)
            : i.data.threads.edges,
        }
        if (Object.entries(mediaList).length === 0) {
          updateList(newList)
        } else {
          updateIncommingList(newList)
        }
      })
      .catch(err => console.log('Error on refetch ', err))
    }
  }, 3000)

  // Initial Load
  React.useEffect(() => {
    if (Object.entries(mediaList).length === 0 || (mediaList.edges && mediaList.edges.length === 0)) {
      updateList(data)
    }
  })

  let position = useWindowScrollPosition(options)
  React.useEffect(() => {
    // If scroll to bottom fetchMore
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
  const [upperLoading, toggleUpperLoading] = React.useState(null)
  const [hasScrolledDown, togglehasScrolledDown] = React.useState(false)
  React.useEffect(() => {
    // If scroll to top update UI
    if (!hasScrolledDown && position.y > 250) {
      togglehasScrolledDown(true)
    }
    else if (hasScrolledDown && incommingList.edges && position.y < 5) {
      // toggleUpperLoading(true)
      togglehasScrolledDown(false)
      updateIncommingList({})
      updateList({
        pageInfo: incommingList.pageInfo,
        edges: incommingList.edges.sort((a, b) => a.node.root.assertedTimestamp - b.node.root.assertedTimestamp).slice(incommingList.edges.length -1, 10)
      })
      console.log('gonna update')
      // window.setTimeout(toggleUpperLoading(false), 2000)
    }
  }, [position.y, hasScrolledDown, incommingList, updateList, updateIncommingList, toggleUpperLoading])
  if (mediaList.edges) {
    return <div>
      {!upperLoading && mediaList.edges.map(media => <Media key={media.node.root.id} {...media.node.root} replies={media.node.replies} />)}
      {(loading || upperLoading) && <CircularProgress />}
    </div>
  } else return <CircularProgress />
}

function MediaList({ hidden, classes, indexing, updateIncommingList, incommingList }) {
  const [mediaList, updateList] = React.useState({})
  const [loading, updateLoading] = React.useState(null)
  const [open, setOpen] = React.useState(false)
  function handleOpen() {
    setOpen(true)
  }

  const handleClose = value => {
    setOpen(false)
  }

  return (
    <Query query={THREADS} partialRefetch>
      {({ data: threadsData, loading: threadsLoading, error: threadsError, fetchMore, refetch }) => (
        <div style={{ display: hidden ? 'none' : 'block' }}>
          {(threadsData && threadsData.threads) && <List
            fetchMore={fetchMore}
            indexing={indexing}
            refetch={refetch}
            incommingList={incommingList}
            updateIncommingList={updateIncommingList}
            data={threadsData.threads}
            updateList={updateList}
            mediaList={mediaList}
            loading={loading}
            toggleLoading={updateLoading}
          />}
          <Fab color="primary" aria-label="Add" className={classes.fab} onClick={handleOpen}>
            <AddIcon />
          </Fab>
          <CreatePost
            open={open}
            handleClose={handleClose}
          />
        </div>
      )}
    </Query>
  )
}

MediaList.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MediaList)
