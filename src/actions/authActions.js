import { LOGIN,ERROR } from "./types";

export const login=(email,password,history)=>dispatch=>{
    console.log('email',email);
    console.log('password',password);
    if(email.trim().toString()===''){
        const message="Write something first!"
        alert(message);    
        dispatch({
            type:ERROR,
            payload:message
        });
        return;
    }

    if(password.trim().toString()===''){
        const message="Enter password first!"    
        alert(message);
        dispatch({
            type:ERROR,
            payload:message
        });

        return;
    }

    if(email.trim().toString()!=='abdulmohsen' || password.trim().toString()!=='Delight001'){
        const message="Stop pretending to be the super admin!"    
        alert(message); 
        dispatch({
            type:ERROR,
            payload:message
        });
        return;
    }

     dispatch({
        type:LOGIN,
        payload:{
            isAuthenticated:true,
            user:{email}
        }
    })
    
    history.push('/');
 
    return;
}