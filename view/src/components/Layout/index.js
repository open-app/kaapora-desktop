import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
// import throttle from 'lodash.throttle'
import Network from '../Network'
import MediaList from '../MediaList'

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);

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
}))(props => <Tab disableRipple {...props} />);

export default function Layout(props) {
  // const classes = useStyles();
  const [value, setValue] = React.useState(0);
  // 
  const [indexing, updateProcess] = React.useState({ loading: true });
  React.useEffect(() => {
    // console.log('process', indexing)
    return () => {
      if (indexing.loading === true) {
        props.process({ variables: { chunkSize: 10e3 }})
        .then(i => {
          if (indexing.latestSequence !== i.data.process.latestSequence) {
            updateProcess(Object.assign(i.data.process, { loading: true }))
          } else {
            updateProcess(Object.assign(i.data.process, { loading: false }))
          }
        })
        .catch(err => console.log('error on process', err))
      }
    };
  })

  function handleChange(event, newValue) {
    setValue(newValue);
  }


  return (
    <React.Fragment>
      <CssBaseline />
      <LinearProgress value={indexing.loading ? null : 100 } variant={indexing.loading ? 'indeterminate' : 'determinate'} />
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
        <AntTab label="Network" />
      </AntTabs>
      <main>
      <MediaList {...props} hidden={value === 1} />
       <Network {...props} hidden={value === 0} />
      </main>
    </React.Fragment>
  );
}
