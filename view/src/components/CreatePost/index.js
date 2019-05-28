import React from 'react'
import { Mutation } from 'react-apollo'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import gql from "graphql-tag"

const CREATE_POST = gql`
  mutation($text: String!) {
	publishPost(text: $text) {
	  content {
	    type
	    text
	  }
	  key
	  sequence
	  text
	  timestamp
	  type
	  author
	  root
	  branch
	  reply {
	    from
	    to
	  }
	  revisionRoot
	  revisionBranch
	  mentions {
	    link
	    rel
	    name
	    type
	    size
	  }
	  channel
	} 
}
`


const useStyles = makeStyles(theme => ({
  form: {
    // display: 'flex',
    // flexDirection: 'column',
    margin: 'auto',
    width: '100%',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}))

function MaxWidthDialog({ open, handleClose}) {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    multiline: '',
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const handleSubmit = action => {
    action({ variables: { text: values.multiline } })
    setValues({ ...values, multiline: '' })
    handleClose()
  }


  return (
    <Mutation mutation={CREATE_POST}>
      {(createPost, { data }) => (
        <Dialog
          fullWidth
          maxWidth='lg'
          open={open}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">Create a new post</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              You can set my maximum width and whether to adapt or not.
            </DialogContentText> */}
            <form className={classes.form} noValidate>
              <TextField
                id="outlined-multiline-flexible"
                label="Post"
                multiline
                rows="6"
                // rowsMax="8"
                value={values.multiline}
                onChange={handleChange('multiline')}
                className={classes.textField}
                margin="normal"
                fullWidth
                // helperText="Post a reply"
                variant="outlined"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleSubmit(createPost)} color="primary">
              Post
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Mutation>
  )
}

export default MaxWidthDialog
