import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {Event,SupervisedUserCircle,MoneyOutlined} from '@material-ui/icons';
import {withRouter} from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  title:{
    flexGrow:1
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Layout=(props)=> {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [navigation, setNavigation] = React.useState(true);


  useEffect(()=>{
    
    const {state,pathname}=props.location;
      console.log('state layout',props.location);

      if(pathname.startsWith('/event/') || pathname==='/login'){
        setNavigation(false);
        return;
      }
      if(pathname==='/'){
        
      }
      setNavigation(true);

  });

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  return (

<div className={navigation?classes.root:''}>
      {navigation?<CssBaseline />:""}
      {navigation?(
      <div>
      <AppBar
        position="fixed"
        style={{backgroundColor:'#001024'}}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {navigation?<IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>:''}
          <Typography className={classes.title} variant="h6" style={{fontFamily:'Luckiest Guy'}} noWrap>
            Delight Control Panel
          </Typography>
          <SupervisedUserCircle/>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
       
        <Divider />
        <List>
          {[{name:'Events',icon:<Event/>,route:'/events'},{name:'Orders',icon:<MoneyOutlined/>,route:'/'},{name:'Users',icon:<SupervisedUserCircle/>,route:'/users'}].map((item, index) => (
            <ListItem style={props.location.pathname===item.route?{backgroundColor:'#f08c22'}:{}}  button key={index} onClick={()=>props.history.push(item.route)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText classes={{
                primary:props.classes.text
              }} primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      </div>):''}
      <main className={clsx({[classes.content]:navigation})}>
        {navigation?<div className={classes.toolbar} />:''}
        {props.children}
      </main>
    
    </div>
  );
}

const styles={
  text:{
    fontFamily:'Luckiest Guy'
  }
}

export default withStyles(styles)(withRouter(Layout));