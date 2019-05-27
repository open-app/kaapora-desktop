import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import Button from '@material-ui/core/Button'
import md from 'ssb-markdown'
import TimeAgo from 'react-timeago'
import Reply from '../Reply'

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexFlow: 'column',
  },
  paper: {
    padding: theme.spacing(2),
    margin: '25px auto 0',
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


function Media({
  replies,
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
  const [showMore, toggleShowMore] = React.useState(null)
  const lastReply = replies[replies.length - 1]
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={`http://localhost:26835/${imageLink}`} />
              <Typography gutterBottom variant="subtitle1">{name}</Typography>
              <TimeAgo date={assertedTimestamp} />
            </ButtonBase>
          </Grid>
          <div dangerouslySetInnerHTML={{__html: md.block(text, opts) }} className={classes.content}></div>
        </Grid>
        {showMore && <div>
          {replies.map(reply => <Reply key={reply.id} classes={classes} {...reply} />)}
          <Button variant="contained" color="primary" className={classes.button} onClick={() => toggleShowMore(false)}>
            Hide comments
          </Button>
        </div>}
        {(lastReply && !showMore) && <div>
          <Reply key={lastReply.id} classes={classes} {...lastReply} />
          {replies.length > 1 && <Button variant="contained" color="primary" className={classes.button} onClick={() => toggleShowMore(true)}>
            Show other {replies.length -1 } comments
          </Button>}
        </div>}
      </Paper>
    </div>
  )
}

Media.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Media)
