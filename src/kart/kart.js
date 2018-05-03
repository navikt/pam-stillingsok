import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import KartApp from './KartApp';
import './../styles.less';
import './kart.less';

ReactDOM.render(
    <div>
        <BrowserRouter>
            <KartApp />
        </BrowserRouter>
    </div>,
    document.getElementById('app')
);
