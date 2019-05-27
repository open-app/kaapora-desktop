import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/core/styles'
import Media from '../Media'

const POSTS = gql`
  query {
    posts {
      edges {
        node {
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

function MediaList({ hidden, classes }) {
  // const [mediaList, updateList] = React.useState([
  //   { id: '0'},
  //   { id: '1'},
  //   { id: '2'},
  // ])
  return (
    <Query query={POSTS}>
      {({ data: postsData, loading: postsLoading, error: postsError }) => (
        <div style={{ display: hidden ? 'none' : 'block' }}>
          {(postsData && postsData.posts) && postsData.posts.edges.map(media => (
            <Media key={media.node.id} {...media.node} />
          )) }
        </div>
      )}
    </Query>
  )
}

MediaList.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MediaList)
