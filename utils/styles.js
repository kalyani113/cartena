import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
  section: {
    margin: '10px 0px'
  },
  form: {
    width: '60%',
    margin: '0 auto'
  },
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
  },
  logo: {
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  flexGrow: {
    flexGrow: 1
  },
  linkToBack: {
    margin: '10px 0px'
  },
  navbarButton: {
    color: '#FFFFFF',
    textTransform: 'capitalize'
  },
  transparentBackground: {
    backgroundColor: 'transparent'
  }
});
export default useStyles;
