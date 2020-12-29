import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './App';
import './index.css';

ReactDOM.render((
    <BrowserRouter>
        <Route path = "/" component = {App}/>
        {/*<Route path = "home" component = {Home} />*/}
        {/*<Route path = "about" component = {About} />*/}
        {/*<Route path = "contact" component = {Contact} />*/}
    </BrowserRouter>
), document.getElementById('root'))

