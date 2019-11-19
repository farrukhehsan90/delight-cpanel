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
// import {EditTwoTone} from '@material-ui/icons';
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
//   { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
//   { id: 'arabic_name', numeric: true, disablePadding: false, label: 'Arabic Name' },
//   { id: 'referral_code', numeric: true, disablePadding: false, label: 'Referral Code' },
//   { id: 'serviceCharge', numeric: true, disablePadding: false, label: 'Service Charge' },
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
//             inputProps={{ 'aria-label': 'select all desserts' }}
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
//             Events
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

// function EnhancedTable(props) {
//   const classes = useStyles();
//   const [rows, setRows] = React.useState([]);
//   const [order, setOrder] = React.useState('asc');
//   const [orderBy, setOrderBy] = React.useState('calories');
//   const [selected, setSelected] = React.useState([]);
//   const [page, setPage] = React.useState(0);
//   const [dense, setDense] = React.useState(false);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);


//   useEffect(()=>{
//     fetch('https://delight-event-planning-58338.firebaseio.com/events.json',{
//       method:"GET"
//     })
//     .then(res=>res.json())
//     .then(res=>{
//       console.log('res',res);
//       const updatedEvents=Object.keys(res).map(event=>res[event]);
//       console.log('updatedEvents',updatedEvents);
//       setRows(updatedEvents);
    
//     });
//   },[])

//   function handleRequestSort(event, property) {
//     const isDesc = orderBy === property && order === 'desc';
//     setOrder(isDesc ? 'asc' : 'desc');
//     setOrderBy(property);
//   }

//   function handleSelectAllClick(event) {
//     if (event.target.checked) {
//       const newSelecteds = rows.map(n => n.name);
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
//     props.history.push(`/event/${id}`);
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
//                   const isItemSelected = isSelected(row.name);
//                   const labelId = `enhanced-table-checkbox-${index}`;

//                   return (
//                     <TableRow
//                       hover
//                       onClick={event => handleClick(event, row.name)}
//                       role="checkbox"
//                       aria-checked={isItemSelected}
//                       tabIndex={-1}
//                       key={row.name}
//                       selected={isItemSelected}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isItemSelected}
//                           inputProps={{ 'aria-labelledby': labelId }}
//                         />
//                       </TableCell>
//                       <TableCell component="th" id={labelId} scope="row" padding="none">
//                         {row.name}
//                       </TableCell>
//                       <TableCell align="right">{row.arabic_name}</TableCell>
//                       <TableCell align="right">{row.referral_code}</TableCell>
//                       <TableCell align="right">{row.serviceCharge!==undefined?row.serviceCharge:'NA'}</TableCell>
//                       <TableCell style={{cursor:'pointer'}} onClick={()=>onClickEdit(row.name)} align="right"><EditTwoTone style={{fontSize:20}}/></TableCell>
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

// export default withRouter( EnhancedTable);

import React, { Component } from "react";
import ReactTable from "react-table";
import {Typography, Fab, Dialog, TextField, DialogTitle, DialogContent, Button} from '@material-ui/core';
import "react-table/react-table.css";
import { Add, Edit, Close } from "@material-ui/icons";

class Events extends Component {
  state = {
    users: [],
    keys:[],
    name:'',
    arabicName:'',
    serviceCharge:'',
    referralCode:'',
    termsAndConditions:''
  };

  componentDidMount() {
    fetch("https://delight-event-planning-58338.firebaseio.com/events.json", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        console.log("res", res);
        const updatedUsers = Object.keys(res).map(event => {return {event:res[event],key:event}});

        this.setState({ users: updatedUsers});
      });
  }

  onChange=(e)=>{
    this.setState({[e.target.name]:e.target.value});
  }

  onAddEvent=()=>{

  const {arabicName,name,termsAndConditions,serviceCharge,referralCode}=this.state;

    const event={
      "arabic_name":arabicName,
      "name" : name,
      "referral_code" : referralCode,
      "serviceCharge" : parseInt(serviceCharge),
      "termsAndConditions" : termsAndConditions,
      "services" : [ {
        "arabic_name" : "حفلات التخرج",
        "image" : "https://i.ibb.co/yRd6R7z/graduation.png",
        "name" : "Graduation ceremony",
        "serviceCharge" : parseInt(serviceCharge),
        "subservices" : []
      }, {
        "arabic_name" : "الرحلات الداخلية",
        "image" : "https://i.ibb.co/t3zKTWm/bus.png",
        "name" : "Local trips",
        "serviceCharge" : parseInt(serviceCharge),
        "subservices" : []
      }, {
        "arabic_name" : "الرحلات الخارجية",
        "image" : "https://i.ibb.co/ZSX6wL1/luggage.png",
        "name" : "Travel trips",
        "serviceCharge" : parseInt(serviceCharge),
        "subservices" : [ ]
      }, {
        "arabic_name" : "الدعوات",
        "image" : "https://i.ibb.co/1rkHHqh/mail.png",
        "name" : "Invitation services",
        "serviceCharge" : parseInt(serviceCharge),
        "subservices" : [ ]
      }, {
        "arabic_name" : "خدمات اضافية",
        "image" : "https://i.ibb.co/02Kf9mL/hoodie.png",
        "name" : "Extra Services",
        "serviceCharge" : parseInt(serviceCharge),
        "subservices" : [ ]
      }, {
        "arabic_name" : "خدمات اخرى",
        "image" : "https://i.ibb.co/N1R8YPW/calendar.png",
        "name" : "Other services",
        "serviceCharge" : parseInt(serviceCharge),
        "subservices" : [ ]
      } ]
    }

    fetch('https://delight-event-planning-58338.firebaseio.com/events.json',{
      method:"POST",
      body:JSON.stringify(event)
    })
    .then(res=>res.json())
    .then(res=>{
      console.log('res',res)
      fetch('https://delight-event-planning-58338.firebaseio.com/events.json',{
        method:"GET"
      })
      .then(res=>res.json())
      .then(events=>{
        console.log('events',events);
        const updatedUsers = Object.keys(events).map(event => {return {event:events[event],key:event}});
        console.log('updatedUsers',updatedUsers);
        this.setState({open:false,users:updatedUsers});
      })
    })
    .catch(err=>console.log('err',err));
    


  }

  onDeleteEvent=(row)=>{
    console.log('row.original',row);
  }

  render() {
    const { users,name,arabicName,serviceCharge,open,referralCode,termsAndConditions } = this.state;
    const columns = [
      // {
      //   id: "fullName",
      //   Header: "Full Name",
      //   accessor: props => {
      //     const { attributes } = props.attributes;
      //     return `${attributes["custom:firstName"]} ${
      //       attributes["custom:middleName"]
      //         ? attributes["custom:middleName"]
      //         : ""
      //     } ${attributes["custom:lastName"]}`;
      //   } // String-based value accessors!
      // },
      {
        id:'name',
        Header: "Name",
        accessor: props=>props.event.name // String-based value accessors!
      },
      {
        id: "arabic_name",
        Header: "Arabic Name",
        accessor: props=>props.event.arabic_name // String-based value accessors!
      },
      {
        id: "referral_code",
        Header: "Referral Code",
        accessor: props=>props.event.referral_code // String-based value accessors!
      },
      {
        id: "service_charge",
        Header: "Service Charge",
        accessor: props=>props.event.serviceCharge // String-based value accessors!
      }
    ];
    return (
      <div>
      <ReactTable
        data={users}
        columns={columns}
        sortable
        filterable
       
        getTrProps={(state, rowInfo, column, instance)=>{
          
          
          
          
          return {
            onClick:(e,handleOriginal)=>{
              
              console.log('state',state);
              console.log('rowInfo',rowInfo);
              console.log('column',column);
              console.log('instance',instance);
              if(handleOriginal){
                handleOriginal();
                return;
              }
              
              this.props.history.push({pathname:`/event/${rowInfo.original.key}`,state:{row:rowInfo.original.event,key:rowInfo.original.key}});
              
            } 
          }}}
          defaultFilterMethod={(filter,row,column)=>{
            console.log('filter',filter);
            console.log('row',row);
            console.log('column',column);
            return row[filter.id]!==undefined?row[filter.id].includes(filter.value):true;
          }}
          SubComponent={row => (
            <div>

          </div>
        )}
        />
        <div style={{position:'fixed',bottom:'3%',right:'2%'}}>
        <Fab onClick={()=>this.setState({open:true})}>
            <Add/>
        </Fab>
        </div>
            <Dialog fullWidth open={open} onClose={()=>this.setState({open:false})}>
              <DialogTitle>
                Add Event
              </DialogTitle>
              <DialogContent>
                <div style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly'}}>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                 <Typography>
                     Name
                </Typography>  
                <TextField name="name" onChange={this.onChange} value={name} />  
                 </div> 
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                 <Typography>
                     Arabic Name
                </Typography>  
                <TextField name="arabicName" onChange={this.onChange} value={arabicName} />  
                 </div> 
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                 <Typography>
                     Service Charge
                </Typography>  
                <TextField name="serviceCharge" onChange={this.onChange} value={serviceCharge} />  
                 </div> 
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                 <Typography>
                     Referral Code
                </Typography>  
                <TextField name="referralCode" onChange={this.onChange} value={referralCode} />  
                 </div> 
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                 <Typography>
                     Terms and Conditions
                </Typography>  
                <TextField name="termsAndConditions" onChange={this.onChange} value={termsAndConditions} />  
                 </div> 
                 <Button onClick={this.onAddEvent}>
                Create Event   
                </Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
    );
  }
}

export default Events;




