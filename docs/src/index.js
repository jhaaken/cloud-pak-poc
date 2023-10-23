import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import Home from './Home';

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <App />
  // <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<App />}>
  //       {/* <Route index element={<Home />} /> */}
  //       {/* <Route path="teams" element={<Teams />}>
  //         <Route path=":teamId" element={<Team />} />
  //         <Route path="new" element={<NewTeamForm />} />
  //         <Route index element={<LeagueStandings />} />
  //       </Route> */}
  //     </Route>
  //   </Routes>
  // </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
