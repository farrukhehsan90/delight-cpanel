import React, { Component } from "react";
import {
  ArrowBack,
  AddCircle,
  AddCircleOutline,
  AddOutlined,
  Close,
  Edit,
  Delete
} from "@material-ui/icons";
import {
  Card,
  CardContent,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from "@material-ui/core";

import imageNotAvailable from "../../assets/image-not-available.png";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

class Event extends Component {
  state = {
    editClicked: false,
    event: {},
    key: "",
    open: false,
    name: "",
    arabicName: "",
    referralCode:'',
    serviceCharge:'',
    question: "",
    imageLink: "",
    description: "",
    openSubService: false,
    openSubSubService: false,
    current: {},
    subserviceName: "",
    subserviceArabicName: "",
    subserviceImageLink: "",
    subserviceQuestion: "",
    subservicePrice: "",
    subserviceQuantityAvailable: "",
    subserviceDescription: "",
    subserviceArabicDescription: "",
    subserviceDateOfEvent: null
  };

  componentDidMount() {
    const { state } = this.props.location;

    if (state !== undefined) {
      console.log('state.row',state.row);
      this.setState({ event: state.row, key: state.key,name:state.row.name,arabicName:state.row.arabic_name,referralCode:state.row.referral_code,serviceCharge:state.row.serviceCharge });
    }
  }

  // componentWillReceiveProps(nextProps){
  //   const {state}=nextProps.location;
  //   console.log('nextProps',nextProps);
  //   if(state.row){
  //     console.log('state.row hai',state.row);
  //     this.setState({name:state.row.name});

  //   }

  // }

  onChange = e => {
    console.log("e.target.name", e.target.name);
    console.log("e.target.value", e.target.value);

    this.setState({ [e.target.name]: e.target.value });
  };

  openSubServiceDialog = (e, subservice) => {
    this.setState({ current: subservice, openSubService: true });
  };

  onClickSubSubService = (e, current) => {
    const { event } = this.state;
    console.log("event", event);
    console.log("event[current]", event[current]);
    console.log("current", current);
    const index = event.services.findIndex((ev, index) => {
      // console.log('ev',ev);

      console.log("index", index);
      console.log(
        `${event.services[index].name}===${current.name}`,
        event.services[index].name === current.name
      );
      return event.services[index].name === current.name;
    });

    console.log(index);

    this.setState({ openSubSubService: true });
  };

  onClickSave=()=>{

    const {name,arabicName,serviceCharge,referralCode,event,key}=this.state;

    const newEvent={
      ...event,
      name,
      arabic_name:arabicName,
      referral_code:referralCode,
      serviceCharge:parseInt(serviceCharge)
    }

    fetch(
      `https://delight-event-planning-58338.firebaseio.com/events/${key}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(newEvent)
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log("updated!", res);
        return this.setState({
          event: newEvent,
          editClicked: false
        });
      })
      .catch(err => console.log("err", err));


    console.log('newEvent',newEvent);

  }

  onDeleteSubService=(e,selectedSubservice)=>{

    const {current,event,key}=this.state;

    const index=current.subservices.findIndex(subservice=>selectedSubservice.name===subservice.name);

    console.log('index',index);
    console.log('current',current);
    const newCurrent={...current};
    newCurrent.subservices.splice(index,1);

    console.log('newCurrent',newCurrent);

    const serviceIndex = event.services.findIndex(
      service => service.name === newCurrent.name
    );

    const splicedEvent = event.services.splice(serviceIndex, 1);

    console.log('splicedEvent',splicedEvent);

    const updatedEvent = {
      ...event,
      services: event.services.concat(newCurrent)
    };
    console.log('updatedEvent',updatedEvent);
    fetch(
      `https://delight-event-planning-58338.firebaseio.com/events/${key}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(updatedEvent)
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log("updated!", res);
        return this.setState({
          event: updatedEvent,
          // openSubSubService: false,
          current: newCurrent
        });
      })
      .catch(err => console.log("err", err));


  }


  onAddSubService = () => {
    const {
      key,
      event,
      current,
      subserviceName,
      subserviceArabicName,
      subserviceDescription,
      subserviceArabicDescription,
      subserviceImageLink,
      subserviceQuantityAvailable,
      subserviceQuestion,
      subservicePrice,
      subserviceDateOfEvent
    } = this.state;

    const subservice = {
      name: subserviceName,
      arabic_name: subserviceArabicName,
      description: subserviceDescription,
      arabic_description: subserviceArabicDescription,
      image_link: subserviceImageLink,
      quantityAvailable: parseInt(subserviceQuantityAvailable),
      price: parseInt(subservicePrice),
      custom_question: subserviceQuestion,
      dateOfInvitation:subserviceDateOfEvent
      
    };

    console.log("current", current);
    console.log("new subservice", subservice);
    const newCurrent = {
      ...current,
      subservices: current.subservices?current.subservices.concat(subservice):[subservice]
    };
    console.log("newCurrent", newCurrent);

    const index = event.services.findIndex(
      service => service.name === current.name
    );

    const splicedEvent = event.services.splice(index, 1);

    const updatedEvent = {
      ...event,
      services: event.services.concat(newCurrent)
    };

    fetch(
      `https://delight-event-planning-58338.firebaseio.com/events/${key}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(updatedEvent)
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log("updated!", res);
        return this.setState({
          event: updatedEvent,
          openSubSubService: false,
          subserviceName:'',
          subserviceArabicName:'',
          subserviceDescription:'',
          subserviceArabicDescription:'',
          subserviceImageLink:'',
          subserviceQuantityAvailable:'',
          subservicePrice:'',
          subserviceQuestion:'',
          current: newCurrent
        });
      })
      .catch(err => console.log("err", err));

    console.log("updatedEvent", updatedEvent);
  };

  onDeleteEvent=()=>{
    const {key}=this.state;
    if(window.confirm('Are you sure? This cannot be undone!')){

      fetch(`https://delight-event-planning-58338.firebaseio.com/events/${key}.json`,{
        method:"DELETE"
      })
      .then(res=>{
        console.log(res)
        return this.props.history.push('/events');
      })
      
    }
  }

  render() {
    const {
      event,
      editClicked,
      open,
      name,
      arabicName,
      serviceCharge,
      referralCode,
      description,
      imageLink,
      question,
      openSubService,
      openSubSubService,
      current,
      subserviceName,
      subserviceArabicName,
      subserviceImageLink,
      subservicePrice,
      subserviceQuantityAvailable,
      subserviceQuestion,
      subserviceDescription,
      subserviceArabicDescription,
      subserviceDateOfEvent
    } = this.state;

    let eventContent;
    let dialogContent;
    let subserviceDialogContent;
    let subsubserviceDialogContent;

    if (Object.keys(event).length > 0) {
      eventContent = (
        <div style={{ display: "flex", width: "95%", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            {editClicked?<Button onClick={this.onClickSave} style={{color:'#fff',backgroundColor:"green"}}>Save</Button>:''}
            <Edit style={{padding:'0 3%',cursor:'pointer'}} onClick={() => this.setState({ editClicked: true })} />
            {editClicked?'':<Close onClick={this.onDeleteEvent} style={{color:'red'}}/>}
         
          </div>
          <div>
            <h1>{event.name}</h1>
          </div>
          <div
            style={{
              padding: "4%",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "2% 0",
                justifyContent: "space-between"
              }}
            >
              <Typography>Name</Typography>
              {editClicked ? (
                <TextField name="name" value={name} onChange={this.onChange} />
              ) : (
                <Typography>{event.name}</Typography>
              )}
            </div>
            <div
              style={{
                display: "flex",
                padding: "2% 0",
                justifyContent: "space-between"
              }}
            >
              <Typography>Arabic Name</Typography>
              {editClicked?<TextField value={arabicName} name="arabicName" onChange={this.onChange}/>:<Typography>{event.arabic_name}</Typography>}
            </div>
            <div
              style={{
                display: "flex",
                padding: "2% 0",
                justifyContent: "space-between"
              }}
            >
              <Typography>Referral Code</Typography>
              {editClicked?<TextField name="referralCode" value={referralCode} onChange={this.onChange}/>:<Typography>{event.referral_code}</Typography>}
            </div>
            <div
              style={{
                display: "flex",
                padding: "2% 0",
                justifyContent: "space-between"
              }}
            >
              <Typography>Service Charge</Typography>
              {editClicked?<TextField value={serviceCharge} name="serviceCharge" onChange={this.onChange}/>:<Typography>{event.serviceCharge}</Typography>}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%"
              }}
            >
              <Typography
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                Services:
              </Typography>
              <section
                className="subservice-scroller"
                style={{
                  minWidth: "100%",
                  minHeight: "200px",
                  display: "flex",
                  overflowX: "auto"
                }}
              >
                {event.services.map(subservice => {
                 console.log('service',subservice);
                 return <Card
                    onClick={e => this.openSubServiceDialog(e, subservice)}
                    style={{
                      backgroundColor: "orange",
                      color: "#fff",
                      cursor: "pointer",
                      margin: "5px",
                      minWidth: "200px"
                    }}
                  >
                    <CardContent
                      style={{
                        padding: 0,
                        margin: 0,
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Typography>{subservice.name}</Typography>
                      <img
                        src={
                          subservice.image
                            ? subservice.image
                            : imageNotAvailable
                        }
                        style={{ width: 130, height: 130 }}
                      />
                    </CardContent>
                  </Card>
                  }
                )}
              </section>
            </div>
          </div>
        </div>
      );
      dialogContent = (
        <Dialog
          fullWidth
          open={open}
          onClose={() => this.setState({ open: false })}
        >
          {/* <div
            onClick={() => this.setState({ open: false })}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              cursor: "pointer"
            }}
          >
            <Close />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DialogTitle>{`Add a New Service to ${event.name}`}</DialogTitle>
          </div>
          <DialogContent>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "stretch"
                }}
              >
                <div style={{ display: "flex", padding: "6px 0" }}>
                  <Typography
                    style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                  >
                    Name
                  </Typography>
                    <TextField
                      name="subserviceName"
                      value={subserviceName}
                      onChange={this.onChange}
                    />
                </div>
                <div style={{ display: "flex", padding: "6px 0" }}>
                  <Typography
                    style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                  >
                    Arabic Name
                  </Typography>
                  <TextField
                    name="subserviceArabicName"
                    value={subserviceArabicName}
                    onChange={this.onChange}
                  />
                </div>
                <div style={{ display: "flex", padding: "6px 0" }}>
                  <Typography
                    style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                  >
                    Description
                  </Typography>
                  <TextField
                    name="subserviceDescription"
                    value={subserviceDescription}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", padding: "6px 0" }}>
                  <Typography
                    style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                  >
                    Question
                  </Typography>
                  <TextField
                    name="subserviceQuestion"
                    value={subserviceQuestion}
                    onChange={this.onChange}
                  />
                </div>
                <div style={{ display: "flex", padding: "6px 0" }}>
                  <Typography
                    style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                  >
                    Image Link
                  </Typography>
                  <TextField
                    name="subserviceImageLink"
                    value={subserviceImageLink}
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
          </DialogContent> */}
        </Dialog>
      );
    }

    if (Object.keys(current).length > 0) {
      subserviceDialogContent = (
        <Dialog
          fullWidth
          open={openSubService}
          onClose={() =>
            this.setState({ openSubService: false, openSubSubService: false })
          }
        >
          <div
            onClick={() =>
              this.setState({ openSubService: false, openSubSubService: false })
            }
            style={{
              display: "flex",
              justifyContent: "flex-end",
              cursor: "pointer"
            }}
          >
            <Close />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DialogTitle>{`${current.name}`}</DialogTitle>
          </div>
          <DialogContent>
            {!openSubSubService ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Name</Typography>
                  <Typography>{current.name}</Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Arabic Name</Typography>
                  <Typography>{current.arabic_name}</Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Image</Typography>
                  <Typography>{current.image_link}</Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Service Charge</Typography>
                  <Typography>{current.serviceCharge}</Typography>
                </div>
                <div
                  className="subservice-scroller"
                  style={{
                    display: "flex",
                    minWidth: "100%",
                    minHeight: "200px",
                    overflowX: "auto"
                  }}
                >
                  {current.subservices?current.subservices.map(subservice => (
                    <Card
                      style={{
                        backgroundColor: "orange",
                        color: "#fff",
                        margin: "5px",
                        minWidth: "200px"
                      }}
                    >
                      <CardContent
                        style={{
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <div style={{width:'100%',display:'flex',justifyContent:'flex-end',alignItems:'center'}}><Delete style={{cursor:'pointer'}} onClick={(e)=>this.onDeleteSubService(e,subservice)}/></div>
                        <Typography>{subservice.name}</Typography>
                        <img
                          src={
                            subservice.image_link
                              ? subservice.image_link
                              : imageNotAvailable
                          }
                          style={{ width: 130, height: 130 }}
                        />
                      </CardContent>
                    </Card>
                  )):''}
                  <Card
                    onClick={e => this.onClickSubSubService(e, current)}
                    style={{
                      cursor: "pointer",
                      margin: "5px",
                      minWidth: "200px"
                    }}
                  >
                    <CardContent
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Fab
                        style={{
                          transform: "translate(-16%,-48%)",
                          backgroundColor: "orange"
                        }}
                      >
                        <AddOutlined fontSize="large" />
                      </Fab>
                    </CardContent>
                  </Card>
                  {console.log("current.subservices", current.subservices)}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "stretch"
                  }}
                >
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Name
                    </Typography>
                    <TextField
                      name="subserviceName"
                      value={subserviceName}
                      onChange={this.onChange}
                    />
                  </div>
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Arabic Name
                    </Typography>
                    <TextField
                      name="subserviceArabicName"
                      value={subserviceArabicName}
                      onChange={this.onChange}
                    />
                  </div>
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Description
                    </Typography>
                    <TextField
                      name="subserviceDescription"
                      value={subserviceDescription}
                      onChange={this.onChange}
                    />
                  </div>
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Arabic Description
                    </Typography>
                    <TextField
                      name="subserviceArabicDescription"
                      value={subserviceArabicDescription}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Question
                    </Typography>
                    <TextField
                      name="subserviceQuestion"
                      value={subserviceQuestion}
                      onChange={this.onChange}
                    />
                  </div>
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Image Link
                    </Typography>
                    <TextField
                      name="subserviceImageLink"
                      value={subserviceImageLink}
                      onChange={this.onChange}
                    />
                  </div>
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Price
                    </Typography>
                    <TextField
                      name="subservicePrice"
                      value={subservicePrice}
                      onChange={this.onChange}
                    />
                  </div>
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                      Quantity Available
                    </Typography>
                    <TextField
                      name="subserviceQuantityAvailable"
                      value={subserviceQuantityAvailable}
                      onChange={this.onChange}
                    />
                  </div>
                  <div style={{ display: "flex", padding: "6px 0" }}>
                    <Typography
                      style={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                    >
                    {'Event Date'}
                    </Typography>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      placeholder="(Only for Grad. Cerem.)"
                      clearable
                      name="subserviceDateOfEvent"
                      value={subserviceDateOfEvent}
                      onChange={(e)=>this.setState({subserviceDateOfEvent:e?e._d:e})}
                      />
                      </MuiPickersUtilsProvider>
                  </div>

                  <Button onClick={() => this.onAddSubService()}>
                    Add Subservice
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          //   width: "99vw",
          //   height: "99vh",
          //   padding: "1%",
          position: "relative"
        }}
      >
        <div
          style={{ display: "flex" }}
          onClick={() => {
            this.setState({ zabardastiKa: "same" });
            this.props.history.push("/events");
          }}
        >
          <ArrowBack />
        </div>
        <Card style={{ marginTop: "1%" }}>
          <CardContent style={{ height: "100%" }}>{eventContent}</CardContent>
        </Card>
        {dialogContent}
        {subserviceDialogContent}
      </div>
    );
  }
}

export default Event;
