import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import md from 'ssb-markdown'
import TimeAgo from 'react-timeago'

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexFlow: 'column',
  },
  paper: {
    background: 'rgba(0,0,0,0.15)',
    padding: 10,
    margin: 'auto',
    maxWidth: 968,
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
  content: {
    maxWidth: '100%',
    textAlign: 'left',
    margin: 'auto',
  },
})

const opts = {
  toUrl: ref => `http://localhost:26835/${ref}`,
  toImage: ref => `http://localhost:26835/${ref}`,
  // emoji: emojiAsMarkup => renderEmoji(emojiAsMarkup)
}

function Reply ({ classes, author: { name, imageLink }, likesCount, text, assertedTimestamp }) {
  return <Paper className={classes.paper}>
    <Grid container spacing={2}>
      <Grid item>
        <TimeAgo date={assertedTimestamp} />
        <ButtonBase className={classes.image}>
          <img className={classes.img} alt="complex" src={`http://localhost:26835/${imageLink}`} />
          <Typography gutterBottom variant="subtitle1">{name}</Typography>
          <span>{likesCount} Likes</span>
        </ButtonBase>
      </Grid>
      <div dangerouslySetInnerHTML={{__html: md.block(text, opts) }} className={classes.content}></div>
    </Grid>
  </Paper>
}

export default withStyles(styles)(Reply)