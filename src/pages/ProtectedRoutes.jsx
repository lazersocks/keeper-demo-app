import eb from "@src/eb";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function ProtectedRoutes(){
    const navigate = useNavigate();
    try{
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('user_id');
        const jwt = params.get('jwt');
        if (jwt !== null){
            console.log("No JWT or user_id found")
            eb.persistAuth(jwt, userId);
            window.location.replace("/");
        }
        
    }catch (error){
        console.log("No JWT or user_id found",error)
    }
    let auth = eb.auth.isAuthenticated();
    useEffect(()=>{
        if (!auth){
            navigate("/signup");
        }
    }, [auth])

    return <Outlet></Outlet>
}