import React, { useState, useEffect } from 'react';
import logo from "../../assets/logo.svg";
import { CardContent, Card, Typography, TextField, CardActionArea, CardActions, Button } from '@material-ui/core';
import { SupervisedUserCircleOutlined, VpnKeyOutlined } from '@material-ui/icons';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from '../../actions/authActions';

const Login = (props) => {

    const [state,setState]=useState({
        email:'',
        password:'',
        error:''
    })

    
    const onChange=(e)=>{

        setState({...state,[e.target.name]:e.target.value})
        

    }

    const onClickLogin=()=>{

        const {email,password}=state;

        return props.login(email,password,props.history);

    }

    const {email,password,error}=state;

    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Card style={{backgroundColor:'#001024'}}>
                <CardContent>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <Typography style={{padding:'1% 0',fontFamily:'Luckiest Guy',fontSize:28,color:'#fff'}}>Hey, Super Admin!</Typography>
                {error?<Typography style={{color:'red',fontFamily:'Luckiest Guy'}}>{error}</Typography>:''}
                <div style={{display:'flex',paddingTop:'1.8rem'}}>
            <div style={{padding:'0 15px 10px 0'}}><SupervisedUserCircleOutlined style={{color:'#fff'}}/></div>
            <TextField  style={{backgroundColor:'#fff'}} value={email} name="email" placeholder="Enter username" onChange={onChange}/>
            </div>
            <div style={{display:'flex'}}>
            <div style={{padding:'0 15px 10px 0'}}><VpnKeyOutlined style={{color:'#fff'}}/></div>
            <TextField type="password" style={{backgroundColor:'#fff'}}  value={password} name="password" placeholder="Enter password" onChange={onChange}/>
            </div>
            </div>
                </CardContent>
                    <CardActions style={{display:'flex',justifyContent:'center'}}>
                        <Button variant="contained" onClick={onClickLogin} style={{fontFamily:'Luckiest Guy',color:'#fff',backgroundColor:'orange'}}>
                            Login
                        </Button>
                    </CardActions>
            </Card>
        </div>
    );
}

const mapStateToProps=state=>({
    auth:state.auth
})

export default connect(mapStateToProps,{login})(withRouter(Login));