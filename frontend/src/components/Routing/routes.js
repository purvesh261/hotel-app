import React from 'react';
import Login from '../Login/Login';
import Menu from '../Menu/Menu';
import CreateItem from '../Admin/CreateItem';
import ItemAdmin from '../Admin/ItemAdmin';
import { Route, Routes, Navigate } from 'react-router-dom';

export const ROUTES = [
    { path: '/', key:"MENU", exact:true, element:<Menu />, protected: true, admin: false},
    { path: '/login', key:"LOGIN", exact:true, element:<Login />, protected: false},
    { path: '/admin', key:"ADMIN", exact:true, element:<ItemAdmin />, protected: true, admin: true},
    { path: '/admin/create-item', key:"CREATE_ITEM", exact:true, element:<CreateItem />, protected: true, admin: true},
]



const ProtectedRoute = ({ adminRoute, children}) => 
{
    const user = JSON.parse(localStorage.getItem('user'));
    // redirects to login page if route is protected and user isn't logged in
    if(!user)
    {
        return <Navigate to='/login' />
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