import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
// import throttle from 'lodash.throttle'
import Network from '../Network'
import MediaList from '../MediaList'
// import CircularProgress from '@material-ui/core/CircularProgress'
import PhoneIcon from '@material-ui/icons/Phone'
import HelpIcon from '@material-ui/icons/Help'

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs)

const AntTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />)

function processIndex (process, indexing, updateIndexing) {
  process({ variables: { chunkSize: 10e3 }})
  .then(i => {
    if (indexing.latestSequence !== i.data.process.latestSequence) {
      updateIndexing(Object.assign(i.data.process, { loading: true }))
    } else {
      console.log('PROCESS', i.data.process)
      updateIndexing(Object.assign(i.data.process, { loading: false }))
    }
  })
  .catch(err => {
    console.log('error on process', err)
    updateIndexing({ loading: false, error: true })
  })
}

export default function Layout(props) {
  const { replication } = props
  // Incomming updates
  const [incommingList, updateIncommingList] = React.useState({})

  // Replication
  const [indexing, updateIndexing] = React.useState({ loading: true })
  const [replicating, updateReplication] = React.useState({ loading: false })
  React.useEffect(() => {
    if (replication !== 'loading') {
      if (!replicating.loading && (!replication.progress || replication.progress !== replicating.progress)) {
        const newRep = Object.assign({ loading: true }, replication)
        // console.log('newRep 1', newRep)
        updateReplication(newRep)
      } else if (replication.progress === replicating.progress && replicating.loading) {
        console.log('replication STOP', replicating)
        const newRep = Object.assign({ loading: false }, replication)
        // console.log('newRep 3', newRep)
        updateReplication(newRep)
        processIndex(props.process, indexing, updateIndexing)
      }
    }
  }, [updateReplication, replication, replicating, props, indexing, updateIndexing])
  // PacthQL Indexing
  React.useEffect(() => {
    if (indexing.loading === true) {
      processIndex(props.process, indexing, updateIndexing)
    }
  }, [updateIndexing, indexing, props])
  // Tabs
  const [value, setValue] = React.useState(0)
  function handleChange(event, newValue) {
    setValue(newValue)
  }


  return (
    <React.Fragment>
      <CssBaseline />
      <LinearProgress
        value={indexing.loading ? null : 100 }
        variant={indexing.loading ? 'indeterminate' : 'determinate'}
        color={indexing.error ? 'secondary' : 'primary'}
      />
      <AppBar position="relative">
        <Toolbar>
          {/* <CameraIcon className={classes.icon} /> */}
          <Typography variant="h6" color="inherit" noWrap>
            {process.env.TITLE || 'Kaapora'}
          </Typography>
        </Toolbar>
      </AppBar>
      <AntTabs value={value} onChange={handleChange} variant="fullWidth">
        <AntTab label={`Posts ${incommingList.edges ? incommingList.edges.length : ''}`} />
        <AntTab label="Network" icon={replicating.loading ? <PhoneIcon /> : <HelpIcon />} />
      </AntTabs>
      <main>
        <MediaList
          {...props}
          indexing={indexing}
          updateIncommingList={updateIncommingList}
          incommingList={incommingList}
          hidden={value === 1}
        />
        <Network {...props} hidden={value === 0} />
      </main>
    </React.Fragment>
  )
}
