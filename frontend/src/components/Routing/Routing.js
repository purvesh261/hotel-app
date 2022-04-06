import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ROUTES, RenderRouter } from './routes';

function Routing() {
    return (
        <RenderRouter routes={ROUTES} />
    )
}

export default Routing;