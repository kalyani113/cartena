import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#232f3e',
    '& a': {
      color: '#ffffff',
      marginLeft: 10
    }
  },
  main: {
    minHeight: '80vh'
  },
  footer: {
    textAlign: 'center',
    marginTop: 10
  }
});
export default useStyles;
