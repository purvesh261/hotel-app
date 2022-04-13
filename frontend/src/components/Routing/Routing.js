import React from 'react';
import { ROUTES, RenderRouter } from './routes';

function Routing() {
    return (
        <RenderRouter routes={ROUTES} />
    )
}

export default Routing;