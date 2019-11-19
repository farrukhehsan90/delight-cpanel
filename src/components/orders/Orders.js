import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Send } from "@material-ui/icons";
import * as QRCode from "qrcode";
import { uploadFile } from "react-s3";
import {withRouter} from 'react-router-dom';
import * as azure from "azure-storage";
import {MuiPickersUtilsProvider, DatePicker} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import S3 from "aws-s3";
import {
  Typography,
  Checkbox,
  Fab,
  Modal,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Input,
  withStyles,
  Button
} from "@material-ui/core";
import moment from "moment";

const config = {
  bucketName: "delight-events-qrcode-bucket",
  region: "me-south-1",
  accessKeyId: "AKIAJAYZVECFXKS7QXEQ",
  secretAccessKey: "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"
};

const blobStorage = azure.createBlobService(
  "DefaultEndpointsProtocol=https;AccountName=delighteventsqrcode;AccountKey=tAiZUlPJtzOyqVmU/6QpZIH6P/PuIeTd7bZYQxoeuLrdvCnfGQP+Ep4Fqagzg5H3kVfFLzxNnq4t0Q6EnCMTHA==;EndpointSuffix=core.windows.net"
);
const blobContainer = blobStorage.createContainerIfNotExists(
  "qrcodes",
  { publicAccessLevel: "container" },
  (err, res, response) => {
    if (err) {
      console.log("err", err);
    }
  }
);

const S3Client = new S3(config);

class Orders extends Component {
  state = {
    users: [],
    emails: [],
    qrcodes: {},
    allChecked: false,
    eventDate:null,
    filterId:'',
    filterValue:''
  };

  componentDidMount() {
    let realUsers;
    // const {pathname}=this.props.history.location;
    // console.log('pathname',pathname);
    // if(pathname==='/'){
    //   this.setState({showDateCalender:true});
    // }
    Promise.all([
      fetch("https://delight-event-planning-58338.firebaseio.com/orders.json", {
        method: "GET"
      }),
      fetch("https://delight-event-planning-58338.firebaseio.com/users.json", {
        method: "GET"
      }),
      fetch("https://delight-event-planning-58338.firebaseio.com/events.json", {
        method: "GET"
      })
    ])
      .then(res => res.map(response => response.json()))
      .then(response => {
        response[2].then(eventsRes => {
          const events = Object.keys(eventsRes).map(event => eventsRes[event]);
          response[1].then(users => {
            realUsers = Object.keys(users).map(user => {
              return { user: users[user], key: user };
            });

            response[0].then(res => {
              const updatedUsers = Object.keys(res).map(user => res[user]);
              const emailsToBeChecked = updatedUsers.map(order => {
                return order.purchase
                  ? order.purchase.map(item => {
                      if (item.serviceName) {
                        console.log("order.user", order.user);
                        if (item.serviceName.includes("Graduation")) { 
                          const filteredUsers = realUsers.filter(
                            user => user.user.email === order.user.email
                          );
                          const filteredEvent = events.filter(
                            event => event.name === order.user.eventChosen
                          );
                          console.log("filteredEvent", filteredEvent);
                          return {
                            dateOfInvitation:item.dateOfInvitation,
                            email: order.user.email,
                            checked: false,
                            user: {
                              ...filteredUsers[0].user,
                              numberOfTicketsAvailable:
                                filteredEvent[0].numberOfTickets
                            },
                            key: filteredUsers[0].key
                          };
                        } else {
                          return false;
                        }
                      } else {
                        return false;
                      }
                    })
                  : false;
                // this.setState({emails:{...this.state.emails,[order.user.email]:true}});
              });
              console.log("emailsToBeChecked", emailsToBeChecked);
              const flattenedEmails = [].concat.apply([], emailsToBeChecked);
              // flattenedEmails.map(email=>this.setState({emails:{
              //   ...this.state.emails,
              //   [email.]
              // }})
              console.log("flattenedEmails", flattenedEmails);
              const finalList = flattenedEmails.filter(
                email => email !== false
              );
              console.log("finalList", finalList);
              finalList.map(user => {
                // console.log('user',Object.keys(user)[1]);
                return this.setState({
                  emails: {
                    ...this.state.emails,
                    [user.email]: {
                      ...user,
                      [Object.keys(user)[1]]: true
                    }
                  }
                });
              });
              this.setState({ users: updatedUsers });
            });
          });
        });
      });
  }

  onChangeCheckbox = (e, email, orderId) => {
    const { emails } = this.state;
    console.log("e.target.checked", e.target.checked);

    this.setState({
      emails: {
        ...emails,
        [email]: {
          ...this.state.emails[email],
          checked: e.target.checked
        }
      }
    });
    // console.log('email orderId checked',this.state[`${email}${orderId}`]);
    console.log("email checked", email);
    console.log("orderId checked", orderId);
  };

  onSelectAll = e => {
    const { emails,eventDate } = this.state;

    Object.keys(emails).map(user => {
      console.log('dateOfInvitation',emails[user].dateOfInvitation);
      console.log('eventDate',`${new Date(eventDate).getDate()}/${new Date(eventDate).getMonth()}/${new Date(eventDate).getFullYear()}`);
      console.log('eventDate',`${moment(eventDate).format("DD/MM/YYYY")}`);
      console.log('eventDate?',eventDate?true:false);
      return this.setState({
        emails: {
          ...emails,
          [user]: {
            ...emails[user],
            checked: e.target.checked && eventDate!==null?`${moment(eventDate).format("DD/MM/YYYY")}`===emails[user].dateOfInvitation:e.target.checked
          }
        }
      });
    });
    this.setState({ allChecked: e.target.checked });
  };

  onSendEmails = () => {
    const { emails } = this.state;
    let qrcodes;
    Object.keys(emails).map(user => {
      const { key } = emails[user];
      console.log("key", key);

      const array = new Array(
        parseInt(emails[user].user.numberOfTicketsAvailable + 1)
      );
      array.fill(
        emails[user].user.numberOfTicketsAvailable,
        0,
        emails[user].user.numberOfTicketsAvailable + 1
      );
      const resArray = array.map((item, index) => {
        return QRCode.toDataURL(JSON.stringify({user:emails[user].user,dateOfInvitation:emails[user].dateOfInvitation})).then(
          res => res
        );
      });
      console.log("resArray", resArray);
      Promise.all(resArray)
        .then(images => {
          console.log("promise all", images);
          Promise.all(
            images.map((base64, index) => {
              // console.log('base64',base64);
              console.log("index", index);
              var matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              var type = matches[1];
              var buffer = new Buffer(matches[2], "base64");
              console.log("blobService", blobStorage);
              blobStorage.createBlockBlobFromText(
                "qrcodes",
                `${emails[user].user.phone_number}_ticket_number${index +
                  1}.png`,
                buffer,
                { contentSettings: { contentType: type } },
                (err, res, response) => {
                  if (err) {
                    return console.log("Failed to store qrcodes error:", err);
                  }
                  // this.setState(prevState=>({qrcodes:{...prevState.qrcodes,[`${emails[user].user.phone_number}_ticket_number${index+1}`]:`https://delighteventsqrcode.blob.core.windows.net/qrcodes/${emails[user].user.phone_number}_ticket_number${index+1}.png`}}))
                  qrcodes = {
                    ...qrcodes,
                    [`${emails[user].user.phone_number}_ticket_number${index +
                      1}`]: `https://delighteventsqrcode.blob.core.windows.net/qrcodes/${
                      emails[user].user.phone_number
                    }_ticket_number${index + 1}.png`
                  };
                  const numberOfTickets = {
                    qrcodes,
                    numberOfTicketsAvailable:
                      emails[user].user.numberOfTicketsAvailable
                  };
                  console.log("numberOfTickets", numberOfTickets);
                  fetch(
                    `https://delight-event-planning-58338.firebaseio.com/users/${key}.json`,
                    {
                      method: "PATCH",
                      body: JSON.stringify(numberOfTickets)
                    }
                  )
                    .then(res => res.json())
                    .then(res => {
                      
                      console.log("res", res);
                      this.setState({show:false});
                    });

                  console.log(
                    `${emails[user].user.phone_number}_ticket_number${index +
                      1} created successfully`,
                    response
                  );
                }
              );
            })
          ).then(res => console.log("res", res));
        })

        .then(res => console.log("res promise all", res));

      // console.log('qrcode',res);
      //TODO:Generate Barcode
      //TODO:Update Server
      //TODO:Send Mail with Barcode
    });
  };

  

  render() {
    const { users, allChecked, show, emails,eventDate } = this.state;
    const { classes } = this.props;
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
        id: "checkbox",
        Header: props => (
          <Checkbox
            value={allChecked}
            checked={allChecked}
            onChange={this.onSelectAll}
          />
        ),
        accessor: props => {
          console.log("props checkbox", props);
          const invitationExists = props.purchase
            ? props.purchase.filter(item => {
                console.log("item", item);
                console.log(
                  "exists",
                  item.serviceName
                    ? item.serviceName
                        .toLowerCase()
                        .trim()
                        .includes("Graduation".toLowerCase()) 
                    : false
                );
                console.log('item.dateOfInvitation',new Date('11/11/2019').getDate()===new Date('11/11/2019').getDate())
                return item.serviceName
                  ? item.serviceName
                      .toLowerCase()
                      .trim()
                      .includes("Graduation".toLowerCase()) 
                      // && (eventDate?eventDate===new Date(item.dateOfInvitation):true)
                  : false;
              })
            : "";
          console.log("invitationExists", invitationExists);
          // console.log('thi',invitationExists);
          return invitationExists.length > 0 ? (
            <Checkbox
              value={this.state.emails[props.user.email]}
              checked={this.state.emails[props.user.email].checked}
              onChange={e =>
                this.onChangeCheckbox(
                  e,
                  props.user.email,
                  props.transactionInvoice.OrderId
                )
              }
            />
          ) : null;
        }
      },
      {
        id: "invoice_id",
        Header: "ID",
        accessor: props => props.transactionInvoice.InvoiceId // String-based value accessors!
      },
      {
        id: "name",
        Header: "Name",
        accessor: props => props.transactionInvoice.CustomerName // String-based value accessors!
      },
      {
        id: "phone",
        Header: "Phone",
        accessor: props => props.user.phone_number // String-based value accessors!
      },
      {
        id: "email",
        Header: "Email",
        accessor: props => props.user.email // String-based value accessors!
      },
      {
        id: "event",
        Header: "Event",
        accessor: props => props.user.eventChosen // String-based value accessors!
      }
    ];
    return (
      <div style={{ position: "relative" }}>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',paddingBottom:'3%'}}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker placeholder="Choose your date" clearable value={eventDate} onChange={(e)=>this.setState({eventDate:e?e._d:e})}/>
        </MuiPickersUtilsProvider>
        </div>
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
            console.log("filter", filter);
            console.log("row", row);
            console.log("column", column);
            this.setState({filterId:filter.id,filterValue:filter.value})
            return row[filter.id] !== undefined && filter.id!=='checkbox'
              ? row[filter.id].includes(filter.value)
              : true;
          }}
          SubComponent={row => {
            console.log("row subcomponent", Array.isArray(row));
            console.log("row subcomponent", typeof row);
            let subcomponentContent;
            if (Object.keys(row).length > 0) {
              subcomponentContent = (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "8px"
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Invoice ID :</Typography>
                    <Typography>
                      {row.original.transactionInvoice.InvoiceId}
                    </Typography>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Order ID :</Typography>
                    <Typography>
                      {row.original.transactionInvoice.OrderId}
                    </Typography>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Customer Name :</Typography>
                    <Typography>
                      {row.original.transactionInvoice.CustomerName}
                    </Typography>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Phone Number :</Typography>
                    <Typography>{row.original.user.phone_number}</Typography>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Transaction Date :</Typography>
                    <Typography>
                      {row.original.transactionInvoice.TransactionDate}
                    </Typography>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Payment Gateway Used :</Typography>
                    <Typography>
                      {row.original.transactionInvoice.PaymentGateway}
                    </Typography>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Email :</Typography>
                    <Typography>
                      {row.original.transactionInvoice.CustomerEmail}
                    </Typography>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Event Chosen :</Typography>
                    <Typography>{row.original.user.eventChosen}</Typography>
                  </div>
                  <div>
                    <Typography
                      style={{ display: "flex", alignSelf: "flex-start" }}
                    >
                      Ordered Items :
                    </Typography>
                    {row.original.purchase
                      ? row.original.purchase.map((item, index) => {
                          return (
                            <Typography
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingLeft: "7px"
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                              >
                                <Typography>{`${index + 1}. Name`}</Typography>
                                <Typography>{item.name}</Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                              >
                                <Typography>Price</Typography>
                                <Typography>{`${item.price} KWD`}</Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                              >
                                <Typography>Quantity</Typography>
                                <Typography>{`${item.quantity} unit(s)`}</Typography>
                              </div>
                            </Typography>
                          );
                        })
                      : "NA"}
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Total Amount Paid</Typography>
                    <Typography>{`${row.original.totalPrice} KWD`}</Typography>
                  </div>
                </div>
              );
            }

            return (
              <div style={{ width: "100%", height: "100%" }}>
                {subcomponentContent}
              </div>
            );
          }}
        />
        <Fab
        disabled={!Object.keys(emails).filter(user=>emails[user].checked===true).length>0}
          style={!Object.keys(emails).filter(user=>emails[user].checked===true).length>0?{
            position: "fixed",
            bottom: "2%",
            right: "2%",
            backgroundColor: "#d3d3d3"
          }:{
            position: "fixed",
            bottom: "2%",
            right: "2%",
            backgroundColor: "#d11d53"

          }}
          variant="round"
          onClick={() => this.setState({ show: true })}
        >
          <Send style={!Object.keys(emails).filter(user=>emails[user].checked===true).length>0?{color:'#686'}:{ color: "#fff" }} />
        </Fab>
        <Dialog
          fullWidth
          open={show}
          onClose={() => this.setState({ show: false })}
        >
          <DialogTitle>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              Review Recipients
              <Button
                onClick={this.onSendEmails}
                variant="text"
                style={{ color: "#d11d53" }}
              >
                Send
              </Button>
            </div>
          </DialogTitle>
          <DialogContent>
            {Object.keys(emails).map(email => {
              return emails[email].checked ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography style={{ fontSize: "1.6vw" }}>{email}</Typography>
                  <Typography style={{ fontSize: "1.6vw" }}>
                    {emails[email].user.eventChosen}
                  </Typography>
                  <Input
                    classes={{
                      input: classes.ticketsInputField,
                      root: classes.ticketsInputFieldRoot
                    }}
                    value={emails[email].user.numberOfTicketsAvailable}
                    onChange={e =>
                      this.setState({
                        emails: {
                          ...emails,
                          [email]: {
                            ...emails[email],
                            user: {
                              ...emails[email].user,
                              numberOfTicketsAvailable: e.target.value
                                ? parseInt(e.target.value)
                                : 0
                            }
                          }
                        }
                      })
                    }
                  />
                </div>
              ) : (
                false
              );
            })}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  ticketsInputField: {
    margin: "auto",
    width: "100%",
    textAlign: "center"
  },
  ticketsInputFieldRoot: {
    // margin:'auto',
    width: "8%",
    textAlign: "center"
  }
};

export default withStyles(styles)(withRouter(Orders));
