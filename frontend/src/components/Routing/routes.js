import React from 'react';
import Login from '../Login/Login';
import Menu from '../Menu/Menu';
import CreateItem from '../Admin/CreateItem';
import ItemAdmin from '../Admin/ItemAdmin';
import SignUp from '../Login/SignUp';
import { Route, Routes, Navigate } from 'react-router-dom';
import ItemDetails from '../Menu/ItemDetails';
import jwt_decode from "jwt-decode";

export const ROUTES = [
    { path: '/', key:"MENU", element:<Menu />, protected: true, admin: false},
    { path: '/items/:id', key:"ITEM", element:<ItemDetails />, protected: true, admin: false},
    { path: '/login', key:"LOGIN", element:<Login />, protected: false},
    { path: '/sign-up', key:"SIGNUP", element:<SignUp />, protected: false},
    { path: '/admin', key:"ADMIN", element:<ItemAdmin />, protected: true, admin: true},
    { path: '/admin/create-item', key:"CREATE_ITEM", element:<CreateItem />, protected: true, admin: true},
    { path: '/admin/edit/:id', key:"UPDATE_ITEM", element:<CreateItem />, protected: true, admin: true},
]

const parseJwt = (token) => {
    try {
        return jwt_decode(token);
    } catch (e) {
        return null;
    }
};

const ProtectedRoute = ({ adminRoute, children}) => 
{
    const user = JSON.parse(localStorage.getItem('user'));
    // redirects to login page if route is protected and user isn't logged in
    if(!user)
    {
        return <Navigate to='/login' />
    }
    else{
        // logs out if token is expired
        const decodedJwt = parseJwt(user.accessToken);
        if (decodedJwt.exp * 1000 < Date.now()) {
            localStorage.clear();
            return <Navigate to='/login' />
        }
    }

    if(adminRoute && !user.admin)
    {
        return <Navigate to='/' />
    }
    return children;
}

function renderRoute(route){
    if(route.protected)
    {
        return <Route
                path={route.path}
                key={route.key}
                exact={route.exact}
                element={
                    <ProtectedRoute adminRoute={route.admin}>
                        {route.element}
                    </ProtectedRoute> 
                }
                />
    }
    else{
        return <Route {...route} />
    }
}

export function RenderRouter({ routes }) {
    return (
        <Routes>
            {routes.map(route => {
                return renderRoute(route);
            })}
            <Route path="/*" element={<h1>Page Not Found!</h1>} />
        </Routes>
    );
  }