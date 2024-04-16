import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';

// Amplify.configure({
//   API: {
//     GraphQL: {
//       endpoint: process.env.REACT_APP_APPSYNC_ENDPOINT,
//       region: process.env.REACT_APP_AWS_REGION,
//       defaultAuthMode: 'iam',
//     }
//   },
//   Auth: {
//     Cognito: {
//       region: process.env.REACT_APP_AWS_REGION,
//       userPoolClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
//       userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
//       loginWith: {
//         oauth: {
//           domain: 'https://tleftest.auth.ca-central-1.amazoncognito.com',
//           scope: ['openid'],
//           redirectSignIn: 'http://localhost:3000/staging',
//           redirectSignOut: 'http://localhost:3000/',
//           responseType: 'code'
//         },
//         username: 'true'
//       },
//       identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
//       allowGuestAccess: true,
//     }
//   }
// });


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <App />
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
