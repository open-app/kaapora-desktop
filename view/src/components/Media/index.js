import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import md from 'ssb-markdown'

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
    width: 200,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
})

function Media({
  classes,
  id,
  author: {
    id: authorId,
    name,
    imageLink,
  },
  text,
  likesCount,
  likes,
  receivedTimestamp,
  assertedTimestamp,
  forks,
}) {
  // const [mediaList, updateList] = React.useState([
  //   { id: '0'},
  //   { id: '1'},
  //   { id: '2'},
  // ])
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={`http://localhost:26835/${imageLink}`} />
              <p>{name}</p>
              <p>{new Date(assertedTimestamp).toLocaleTimeString()}</p>
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {likesCount} Likes
                </Typography>
                <Typography variant="body2" color="textSecondary">
                <div dangerouslySetInnerHTML={{__html: md(text) }} >
                </div>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  Remove
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{likesCount} Likes</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

Media.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Media)
