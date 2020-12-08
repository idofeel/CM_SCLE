import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import Scle from './routes/scleView'

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

// 兼容IE11

ReactDOM.render(<Scle />, document.getElementById('scleView'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);