import React from 'react'
import { useLocation, Outlet, Navigate } from 'react-router-dom'
import {UseAuthHook} from './UseAuthHook';

export const RequireAuth = () => {
    const location = useLocation();

    const { username } = UseAuthHook();

    if(username) {
        const content = (
            username ? <Outlet /> : <Navigate to='/login' state={{from: location}} />
        )
        return content
    }
    
}

export const RequireAuthForNonLogged = () => {

    const location = useLocation();
    const { username } = UseAuthHook();

    const content = (
        username ? <Navigate to='/' state={{ from: location }} /> : <Outlet />
    )
    return content;

}
