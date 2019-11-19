// import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import clsx from 'clsx';
// import { lighten, makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
// import TableSortLabel from '@material-ui/core/TableSortLabel';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
// import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';
// import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';
// import {EditTwoTone, MoreVertRounded} from '@material-ui/icons';
// import {withRouter} from 'react-router-dom';

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// // const rows = [
// //   createData('Cupcake', 305, 3.7, 67, 4.3),
// //   createData('Donut', 452, 25.0, 51, 4.9),
// //   createData('Eclair', 262, 16.0, 24, 6.0),
// //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
// //   createData('Gingerbread', 356, 16.0, 49, 3.9),
// //   createData('Honeycomb', 408, 3.2, 87, 6.5),
// //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
// //   createData('Jelly Bean', 375, 0.0, 94, 0.0),
// //   createData('KitKat', 518, 26.0, 65, 7.0),
// //   createData('Lollipop', 392, 0.2, 98, 0.0),
// //   createData('Marshmallow', 318, 0, 81, 2.0),
// //   createData('Nougat', 360, 19.0, 9, 37.0),
// //   createData('Oreo', 437, 18.0, 63, 4.0),
// // ];

// function desc(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function stableSort(array, cmp) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = cmp(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map(el => el[0]);
// }

// function getSorting(order, orderBy) {
//   return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
// }

// const headCells = [
//   { id: 'fullName', numeric: false, disablePadding: true, label: 'Full Name' },
//   { id: 'phone_number', numeric: true, disablePadding: false, label: 'Phone Number' },
//   { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
//   { id: 'event', numeric: true, disablePadding: false, label: 'Event Chosen' },
//   { id: 'edit', numeric: true, disablePadding: false, label: '     ' },
// ];

// function EnhancedTableHead(props) {
//   const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
//   const createSortHandler = property => event => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell padding="checkbox">
//           <Checkbox
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={numSelected === rowCount}
//             onChange={onSelectAllClick}
//             inputProps={{ 'aria-label': 'select all users' }}
//           />
//         </TableCell>
//         {headCells.map(headCell => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.numeric ? 'right' : 'left'}
//             padding={headCell.disablePadding ? 'none' : 'default'}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={order}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <span className={classes.visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                 </span>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   classes: PropTypes.object.isRequired,
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

// const useToolbarStyles = makeStyles(theme => ({
//   root: {
//     paddingLeft: theme.spacing(2),
//     paddingRight: theme.spacing(1),
//   },
//   highlight:
//     theme.palette.type === 'light'
//       ? {
//           color: theme.palette.secondary.main,
//           backgroundColor: lighten(theme.palette.secondary.light, 0.85),
//         }
//       : {
//           color: theme.palette.text.primary,
//           backgroundColor: theme.palette.secondary.dark,
//         },
//   spacer: {
//     flex: '1 1 100%',
//   },
//   actions: {
//     color: theme.palette.text.secondary,
//   },
//   title: {
//     flex: '0 0 auto',
//   },
// }));

// const EnhancedTableToolbar = props => {
//   const classes = useToolbarStyles();
//   const { numSelected } = props;

//   return (
//     <Toolbar
//       className={clsx(classes.root, {
//         [classes.highlight]: numSelected > 0,
//       })}
//     >
//       <div className={classes.title}>
//         {numSelected > 0 ? (
//           <Typography color="inherit" variant="subtitle1">
//             {numSelected} selected
//           </Typography>
//         ) : (
//           <Typography variant="h6" id="tableTitle">
//             Users
//           </Typography>
//         )}
//       </div>
//       <div className={classes.spacer} />
//       <div className={classes.actions}>
//         {numSelected > 0 ? (
//           <Tooltip title="Delete">
//             <IconButton aria-label="delete">
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         ) : (
//           <Tooltip title="Filter list">
//             <IconButton aria-label="filter list">
//               <FilterListIcon />
//             </IconButton>
//           </Tooltip>
//         )}
//       </div>
//     </Toolbar>
//   );
// };

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     marginTop: theme.spacing(3),
//   },
//   paper: {
//     width: '100%',
//     marginBottom: theme.spacing(2),
//   },
//   table: {
//     minWidth: 750,
//   },
//   tableWrapper: {
//     overflowX: 'auto',
//   },
//   visuallyHidden: {
//     border: 0,
//     clip: 'rect(0 0 0 0)',
//     height: 1,
//     margin: -1,
//     overflow: 'hidden',
//     padding: 0,
//     position: 'absolute',
//     top: 20,
//     width: 1,
//   },
// }));

// function Users(props) {
//   const classes = useStyles();
//   const [rows, setRows] = React.useState([]);
//   const [order, setOrder] = React.useState('asc');
//   const [orderBy, setOrderBy] = React.useState('phone_number');
//   const [selected, setSelected] = React.useState([]);
//   const [page, setPage] = React.useState(0);
//   const [dense, setDense] = React.useState(false);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   useEffect(()=>{
//     fetch('https://delight-event-planning-58338.firebaseio.com/users.json',{
//       method:"GET"
//     })
//     .then(res=>res.json())
//     .then(res=>{
//       console.log('res',res);
//       const updatedUsers=Object.keys(res).map(event=>res[event]);
//       console.log('updatedUsers',updatedUsers);
//       setRows(updatedUsers);

//     });
//   },[])

//   function handleRequestSort(event, property) {
//       console.log('event',event);
//       console.log('property',property);
//     const isDesc = orderBy === property && order === 'desc';
//     setOrder(isDesc ? 'asc' : 'desc');
//     setOrderBy(property);

//   }

//   function handleSelectAllClick(event) {
//     if (event.target.checked) {
//       const newSelecteds = rows.map(n => n.phone_number);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   }

//   function handleClick(event, name) {
//     const selectedIndex = selected.indexOf(name);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, name);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1),
//       );
//     }

//     setSelected(newSelected);
//   }

//   function handleChangePage(event, newPage) {
//     setPage(newPage);
//   }

//   function handleChangeRowsPerPage(event) {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   }

//   function handleChangeDense(event) {
//     setDense(event.target.checked);
//   }

//   const onClickEdit=(id)=>{
//     console.log('id',id);
//     props.history.push(`/user/${id}`);
//   }

//   const isSelected = name => selected.indexOf(name) !== -1;

//   const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

//   return (
//     <div className={classes.root}>
//       <Paper className={classes.paper}>
//         <EnhancedTableToolbar numSelected={selected.length} />
//         <div className={classes.tableWrapper}>
//           <Table
//             className={classes.table}
//             aria-labelledby="tableTitle"
//             size={dense ? 'small' : 'medium'}
//           >
//             <EnhancedTableHead
//               classes={classes}
//               numSelected={selected.length}
//               order={order}
//               orderBy={orderBy}
//               onSelectAllClick={handleSelectAllClick}
//               onRequestSort={handleRequestSort}
//               rowCount={rows.length}
//             />
//             <TableBody>
//               {stableSort(rows, getSorting(order, orderBy))
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row, index) => {
//                   const isItemSelected = isSelected(row.attributes.attributes['custom:firstName']);
//                   const labelId = `enhanced-table-checkbox-${index}`;

//                   return (
//                     <TableRow
//                       hover
//                       onClick={event => handleClick(event, row.attributes.attributes['custom:firstName'])}
//                       role="checkbox"
//                       aria-checked={isItemSelected}
//                       tabIndex={-1}
//                       key={index}
//                       selected={isItemSelected}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isItemSelected}
//                           inputProps={{ 'aria-labelledby': labelId }}
//                         />
//                       </TableCell>
//                       <TableCell component="th" id={labelId} scope="row" padding="none">
//                         {row.attributes.attributes['custom:firstName']}
//                       </TableCell>
//                       <TableCell align="right">{row.phone_number}</TableCell>
//                       <TableCell align="right">{row.email}</TableCell>
//                       <TableCell align="right">{row.eventChosen}</TableCell>
//                       <TableCell style={{cursor:'pointer'}} onClick={()=>onClickEdit(row.name)} align="right"><MoreVertRounded style={{fontSize:20}}/></TableCell>
//                     </TableRow>
//                   );
//                 })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 49 * emptyRows }}>
//                   <TableCell colSpan={6} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           backIconButtonProps={{
//             'aria-label': 'previous page',
//           }}
//           nextIconButtonProps={{
//             'aria-label': 'next page',
//           }}
//           onChangePage={handleChangePage}
//           onChangeRowsPerPage={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <FormControlLabel
//         control={<Switch checked={dense} onChange={handleChangeDense} />}
//         label="Dense padding"
//       />
//     </div>
//   );
// }

import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Button, Typography, Select, Checkbox } from "@material-ui/core";
import {Auth,AuthClass,JS} from 'aws-amplify';

class Users extends Component {
  state = {
    users: [],
    emailToUsers:[],
    onHoldShow:false
  };

  componentDidMount() {

    


    fetch("https://delight-event-planning-58338.firebaseio.com/users.json", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        console.log("res", res);
        const updatedUsers = res?Object.keys(res).map(user =>{return { user:res[user],key:user}}):[];

        this.setState({ users: updatedUsers });
      });
  }

  onDeleteUser=(row)=>{
    console.log('row',row.original);
    const {key}=row.original;
  
    if(window.confirm('Are you sure? This cannot be undone')){

      
      fetch(`https://delight-event-planning-58338.firebaseio.com/users/${key}.json`,{
        method:"DELETE"
      })
      .then(res=>res.json())
      .then(res=>{
        console.log('res',res)
        
        if(res===null){
          fetch('https://delight-event-planning-58338.firebaseio.com/users.json',{
            method:'GET'
          })
          .then(res=>res.json())
          .then(res=>{
            
            const updatedUsers = Object.keys(res).map(user =>{return { user:res[user],key:user}});
            
            this.setState({ users: updatedUsers });
            
          })
        }
        
      })
      .catch(err=>console.log('err',err))
      
    }
    }

  
    
  render() {
    const { users,onHoldShow } = this.state;
    const columns = [
     
      {
        id: "fullName",
        Header: "Full Name",
        accessor: props => {
          // console.log('props',props.user.attributes["custom:firstName"]);
          console.log('props',props.user.attributes);
          const { attributes } = props.user;
          
          return `${attributes.attributes!==undefined?attributes.attributes["custom:firstName"]:attributes['custom:firstName']} ${
            attributes.attributes!==undefined?attributes.attributes["custom:middleName"]:attributes['custom:middleName']
              // ? attributes["custom:middleName"]
              // : ""
          } ${attributes.attributes!==undefined?attributes.attributes["custom:lastName"]:attributes['custom:lastName']}`;
        } // String-based value accessors!
      },
      {
        id: "phone_number", // String-based value accessors!
        Header: "Phone",
        accessor: props=>props.user.phone_number // String-based value accessors!
      },
      {
        id: "email", // String-based value accessors!
        Header: "Email",
        accessor: props=>props.user.email // String-based value accessors!
      },
      {
        id: "eventChosen", // String-based value accessors!
        Header: "Event",
        accessor: props=>props.user.eventChosen // String-based value accessors!
      },
      {
        id:"serviceName",
        Header:"Service",
        accessor:'nothing'
      }
    ];
    return (
      <ReactTable
        data={users}
        columns={columns}
        sortable
        filterable
        getTrProps={()=>{

    

          

          return {
            onClick:(e,handleOriginal)=>{

              if(handleOriginal){
                // handleOriginal();
                return;
              }
              else{

                console.log('e click',e)
              }

            } 
        }}}
        defaultFilterMethod={(filter,row,column)=>{
            console.log('filter',filter);
            console.log('row',row);
            console.log('column',column);
            return row[filter.id]!==undefined?row[filter.id].includes(filter.value):true;
        }}
        SubComponent={row => 
          {
            const {attributes}=row.original.user.attributes;
            console.log('row',row);
            return onHoldShow?<div style={{padding:'5%',position:'relative',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Typography variant="h5">{`Delete ${attributes['custom:firstName']} ${attributes['custom:lastName']}`}<a href="https://us-east-2.console.aws.amazon.com/cognito/users/?region=us-east-2#/pool/us-east-2_iJsHegaSd/users?_k=8pmhsw" target="_BLANK">here</a> first</Typography>
            <Button onClick={()=>this.onDeleteUser(row)} variant="contained" style={{backgroundColor:'green',position:'absolute',right:'2%',bottom:'2%'}}>{`Done, Remove ${attributes['custom:firstName']} ${attributes['custom:lastName']}`}</Button>
          </div>:<div style={{padding:'0 2%',width:'100%',display:'flex',justifyContent:'flex-end',alignItems:'flex-end'}}>
            <Button style={{backgroundColor:'red',color:'#fff'}} onClick={()=>{this.setState({onHoldShow:true,currentRow:row})}}>Delete User</Button>
          </div>}
        }
      />
    );
  }
}

export default Users;

// export default withRouter( Users);
