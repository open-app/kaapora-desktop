import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));


function MediaControlCard({ gossip, replication, hidden }) {
  const [peerList, updatePeers] = React.useState([]);
  const exists = host => {
    const list = peerList.filter(p => {
      return p.peer.host === host
    })
    return list.length > 0
  }
  const update = () => {
    let mutable = peerList
    if (!exists(gossip.peer.host)) {
      mutable.push(gossip)
      updatePeers(mutable)
    } else {
      let newList = mutable.filter(p => p.peer.host !== gossip.peer.host)
      newList.push(gossip)
      updatePeers(newList)
    }
  }
  React.useEffect(() => {
    if (gossip.type && Array.isArray(peerList)) {
      // console.log('GOSSIP', gossip.type, gossip.peer.host)
      update()
      // switch(gossip.type) {
      //   case 'discover':
      //     update()
      //     break
      //   case 'connect':
      //     update()
      //     break
      //   case 'remove':
      //     const removedList = peerList.filter(p => p.host !== gossip.peer.host)
      //     console.log('newList', removedList)
      //     updatePeers(removedList)
      //     break
      //   default:
      //     break
      // }
    }
  });

  const classes = useStyles();

  return (
    <div style={{ display: hidden ? 'none' : 'block' }}>
      {peerList.map((p) => 
        <Card className={classes.card} key={p.peer.host}>
          <div className={classes.details}>
            <div>{(typeof(gossip) === 'string' && gossip !== 'loading') && <span>{gossip}</span>}</div>
            <div>{gossip === 'loading' && <span>...</span>}</div>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                <span>{p.peer.host || 'undefined'}</span>
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                <span>{p.type}</span>
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              {/* <IconButton aria-label="Previous">
                {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
              </IconButton>
              <IconButton aria-label="Play/pause">
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
              <IconButton aria-label="Next">
                {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
              </IconButton> */}
            </div>
          </div>
          <CardMedia
            className={classes.cover}
            image="/static/images/cards/live-from-space.jpg"
            title="Live from space album cover"
          />
        </Card>
      )}
    </div>
  );
}

export default MediaControlCard;
