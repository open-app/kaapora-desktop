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

function processIndex (process, indexing, updateProcess) {
  return process({ variables: { chunkSize: 10e3 }})
  .then(i => {
    // console.log('Called', i)
    if (indexing.latestSequence !== i.data.process.latestSequence) {
      updateProcess(Object.assign(i.data.process, { loading: true }))
    } else {
      updateProcess(Object.assign(i.data.process, { loading: false, error: true }))
    }
  })
  .catch(err => {
    updateProcess({ loading: false, error: true })
    console.log('error on process', err)
  })
}

export default function Layout(props) {
  const { replication } = props
  // const classes = useStyles()
  const [replicating, updateReplication] = React.useState({ loading: false })
  const [indexing, updateProcess] = React.useState({ loading: true })
  // Replication
  React.useEffect(() => {
    // console.log('replicating', replicating)
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
        processIndex(props.process, indexing, updateProcess)
      }
    }
  }, [updateReplication, replication, replicating, props, indexing, updateProcess])
  // PacthQL Indexing
  React.useEffect(() => {
    if (indexing.loading === true) {
      processIndex(props.process, indexing, updateProcess)
    }
  }, [updateProcess, indexing, props])
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
        color={indexing.error ? 'primary' : 'secondary'}
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
        <AntTab label="Posts" />
        <AntTab label="Network" icon={replicating.loading ? <PhoneIcon /> : <HelpIcon />} />
      </AntTabs>
      <main>
        <MediaList {...props} hidden={value === 1} />
        <Network {...props} hidden={value === 0} />
      </main>
    </React.Fragment>
  )
}
