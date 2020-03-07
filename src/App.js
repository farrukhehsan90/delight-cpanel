import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Provider} from 'react-redux';
import "./App.css";
import Layout from "./components/layout/Layout";
import Events from "./components/events/Events";
import Login from "./components/login/Login";
import Event from "./components/events/Event";
import Users from "./components/users/Users";
import Orders from "./components/orders/Orders";
import Order from "./components/orders/Order";
import store from './store/Store';
import PrivateRoute from "./components/common/PrivateRoute";
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
import firebase from 'firebase';
import { FIREBASE_CONFIG } from "./config";
import ExcelUpload from "./components/excelUpload";
Amplify.configure(awsExports);



class App extends Component {
  componentDidMount() {
    firebase.initializeApp(FIREBASE_CONFIG);
   
  }
  render() {
    console.log('layoutProps',this.props);
    return (
      <Provider store={store}>
      <Router>
        <Layout props={this.props}>
          <div style={{ textAlign: "center", margin: "auto" }}>
            <Route exact path="/login" component={Login}/>
              <PrivateRoute exact path="/events" component={Events} />
              <PrivateRoute exact path="/event/:id" component={Event} />
              <PrivateRoute exact path="/order/:id" component={Order} />
              <PrivateRoute exact path="/users" component={Users} />
              <PrivateRoute exact path="/excel-upload" component={ExcelUpload} />
              <PrivateRoute exact path="/" component={Orders} />
          </div>
        </Layout>
      </Router>
      </Provider>
    );
  }
}

export default App;
