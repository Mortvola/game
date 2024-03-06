import React, { createElement } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './UserInterface/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

type PropsType = { children: React.ReactNode }
const Test2: React.FC<PropsType> = () => (
  <div />
)

const Test: React.FC = () => (
  <Test2>
    Test
  </Test2>
)

const t = createElement(Test)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
