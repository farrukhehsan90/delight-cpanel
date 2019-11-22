import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  Button,
  Typography,
  Select,
  Checkbox,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem
} from "@material-ui/core";
import { Auth, AuthClass, JS } from "aws-amplify";
import { AddToQueueSharp } from "@material-ui/icons";

class Users extends Component {
  state = {
    users: [],
    emailToUsers: [],
    onHoldShow: false,
    email: "",
    eventChosen: "",
    countryCode: "+965",
    phone_number: "",
    password: "",
    dateOfBirth: "",
    firstName: "",
    middleName: "",
    lastName: "",
    civilIdNumber: "",
    showUserModal:false,
    numberOfTicketsAvailable:0,
    showAddButton:false
  };

  componentDidMount() {
    fetch("https://delight-event-planning-58338.firebaseio.com/users.json", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        // console.log("res", res);
        const updatedUsers = res
          ? Object.keys(res).map(user => {
              return { user: res[user], key: user };
            })
          : [];

        this.setState({ users: updatedUsers });
      });
  }

  onAddUser = () => {
    const {users,firstName,middleName,lastName,email,civilIdNumber,phone_number,dateOfBirth,eventChosen,password,numberOfTicketsAvailable} = this.state;
  
    if(dateOfBirth.length<=0||phone_number.length<=0||firstName.length<=0 || lastName.length<=0 || middleName.length<=0 || email.length<=0 || !(civilIdNumber<12 || civilIdNumber>12) || eventChosen.length<=0 || password.length<=0){

      return;

    }

    const username=`${firstName.toLowerCase()}${lastName.toLowerCase()}${civilIdNumber}`;


    const user={
      
   attributes:{
      attributes:{'custom:firstName':firstName,
      'custom:middleName':middleName,
      'custom:lastName':lastName,
      'custom:dateOfBirth':dateOfBirth,
      'custom:civilIdNumber':civilIdNumber,
      phone_number,
      email,
    },
    password,
    username
  },
    email,
      phone_number,
      eventChosen,
      numberOfTicketsAvailable,
      username
    }

    fetch('https://delight-event-planning-58338.firebaseio.com/users.json',{
      method:"POST",
      body:JSON.stringify(user)
    })
    .then(res=>res.json())
    .then(response=>{
      console.log('response',response)
      const userToBeInserted={
        key:response.name,
        user
      }
      const usersCopy=[...users].concat(userToBeInserted);


      return this.setState({showUserModal:false,users:usersCopy});
    })
    
  
  };

  onDeleteUser = row => {
    console.log("row", row.original);
    const { key } = row.original;

    if (window.confirm("Are you sure? This cannot be undone")) {
      fetch(
        `https://delight-event-planning-58338.firebaseio.com/users/${key}.json`,
        {
          method: "DELETE"
        }
      )
        .then(res => res.json())
        .then(res => {
          console.log("res", res);

          if (res === null) {
            fetch(
              "https://delight-event-planning-58338.firebaseio.com/users.json",
              {
                method: "GET"
              }
            )
              .then(res => res.json())
              .then(res => {
                const updatedUsers = Object.keys(res).map(user => {
                  return { user: res[user], key: user };
                });

                this.setState({ users: updatedUsers });
              });
          }
        })
        .catch(err => console.log("err", err));
    }
  };

  onChange=(e)=>{
    const {firstName,middleName,lastName,email,civilIdNumber,phone_number,dateOfBirth,eventChosen,password,numberOfTicketsAvailable} = this.state;
  
    if(dateOfBirth.length<=0 || phone_number.length<=0 || firstName.length<=0 || lastName.length<=0 || middleName.length<=0 || email.length<=0 || !(civilIdNumber<12 || civilIdNumber>12) || eventChosen.length<=0 || password.length<=0){

      this.setState({[e.target.name]:e.target.value,showAddButton:false});
      return;

    }

    this.setState({[e.target.name]:e.target.value,showAddButton:true})
    
  }

  render() {
    const {
      users,
      onHoldShow,
      countryCode,
      phone_number,
      email,
      eventChosen,
      dateOfBirth,
      civilIdNumber,
      firstName,
      lastName,
      middleName,
      password,
      showUserModal,
      numberOfTicketsAvailable,
      showAddButton
    } = this.state;
    const columns = [
      {
        id: "fullName",
        Header: "Full Name",
        accessor: props => {
          // console.log('props',props.user.attributes["custom:firstName"]);
          // console.log("props", props.user.attributes);
          const { attributes } = props.user;

          return `${
            attributes.attributes !== undefined
              ? attributes.attributes["custom:firstName"]
              : attributes["custom:firstName"]
          } ${
            attributes.attributes !== undefined
              ? attributes.attributes["custom:middleName"]
              : attributes["custom:middleName"]
            // ? attributes["custom:middleName"]
            // : ""
          } ${
            attributes.attributes !== undefined
              ? attributes.attributes["custom:lastName"]
              : attributes["custom:lastName"]
          }`;
        } // String-based value accessors!
      },
      {
        id: "phone_number", // String-based value accessors!
        Header: "Phone",
        accessor: props => props.user.phone_number // String-based value accessors!
      },
      {
        id: "email", // String-based value accessors!
        Header: "Email",
        accessor: props => props.user.email // String-based value accessors!
      },
      {
        id: "eventChosen", // String-based value accessors!
        Header: "Event",
        accessor: props => props.user.eventChosen // String-based value accessors!
      },
      {
        id: "serviceName",
        Header: "Service",
        accessor: "nothing"
      }
    ];
    return (
      <div style={{ position: "relative" }}>
        <ReactTable
          data={users}
          columns={columns}
          sortable
          filterable
          getTrProps={() => {
            return {
              onClick: (e, handleOriginal) => {
                if (handleOriginal) {
                  // handleOriginal();
                  return;
                } else {
                  console.log("e click", e);
                }
              }
            };
          }}
          defaultFilterMethod={(filter, row, column) => {
            // console.log("filter", filter);
            // console.log("row", row);
            // console.log("column", column);
            return row[filter.id] !== undefined
              ? row[filter.id].includes(filter.value)
              : true;
          }}
          SubComponent={row => {
            const { attributes } = row.original.user.attributes;
            // console.log("row", row);
            return onHoldShow ? (
              <div
                style={{
                  padding: "5%",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography variant="h5">
                  {`Delete ${attributes["custom:firstName"]} ${attributes["custom:lastName"]}`}
                  <a
                    href="https://us-east-2.console.aws.amazon.com/cognito/users/?region=us-east-2#/pool/us-east-2_iJsHegaSd/users?_k=8pmhsw"
                    target="_BLANK"
                  >
                    here
                  </a>{" "}
                  first
                </Typography>
                <Button
                  onClick={() => this.onDeleteUser(row)}
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    position: "absolute",
                    right: "2%",
                    bottom: "2%"
                  }}
                >{`Done, Remove ${attributes["custom:firstName"]} ${attributes["custom:lastName"]}`}</Button>
              </div>
            ) : (
              <div
                style={{
                  padding: "0 2%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end"
                }}
              >
                <Button
                  style={{ backgroundColor: "red", color: "#fff" }}
                  onClick={() => {
                    this.setState({ onHoldShow: true, currentRow: row });
                  }}
                >
                  Delete User
                </Button>
              </div>
            );
          }}
        />
        <Fab
          onClick={()=>this.setState({showUserModal:true})}
          variant="round"
          style={{ position: "fixed", bottom: "3%", right: "3%" }}
        >
          <AddToQueueSharp />
        </Fab>

        <Dialog fullWidth open={showUserModal} onClose={()=>this.setState({showUserModal:false})}>
          <DialogTitle></DialogTitle>
          <DialogContent>
            <div style={{ width: "100%", height: "100%" }}>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Phone Number</Typography>
                <div>
                  <Select
                    value={countryCode}
                    onChange={e =>
                      this.setState({ countryCode: e.target.value })
                    }
                  >
                    <MenuItem value="+965">+965</MenuItem>
                  </Select>
                  <TextField
                    value={phone_number}
                    name="phone_number"
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Email</Typography>
                <TextField value={email} name="email" onChange={this.onChange}/>
             
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>First Name</Typography>
                <TextField value={firstName} name="firstName" onChange={this.onChange}/>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Middle Name</Typography>
                <TextField value={middleName} name="middleName" onChange={this.onChange}/>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Last Name</Typography>
                <TextField value={lastName} name="lastName" onChange={this.onChange}/>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Civil ID Number</Typography>
                <TextField value={civilIdNumber} name="civilIdNumber" onChange={this.onChange}/>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Date Of Birth</Typography>
                <TextField value={dateOfBirth} name="dateOfBirth" onChange={this.onChange}/>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography style={{whiteSpace:'pre-wrap'}}>{'Number Of Tickets to be given \n(Only for Graduation Ceremony Students)'}</Typography>
                <TextField type="number" value={numberOfTicketsAvailable} name="numberOfTicketsAvailable" onChange={this.onChange}/>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Event Chosen</Typography>
                <TextField value={eventChosen} name="eventChosen" onChange={this.onChange}/>
              </div>
              <div style={{display:'flex',width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Typography>Password</Typography>
                <TextField type="password" value={password} name="password" onChange={this.onChange}/>
              </div>
                <div style={{padding:'3% 0',display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                  <Button onClick={this.onAddUser} disabled={firstName.length<=0 || !showAddButton} style={firstName.length>0 && showAddButton?{color:'#fff',backgroundColor:'#ffa500'}:{backgroundColor:'#ececec',color:'#808080'}}>{firstName.length>0 && showAddButton?`Create ${firstName}`:'Please fill all details'}</Button>
                </div>
             
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Users;

// export default withRouter( Users);
