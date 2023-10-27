// import logo from './logo.svg';
import './app.scss';

import { Helmet } from 'react-helmet';
import { Content, Theme } from '@carbon/react';
import MainHeader from './components/MainHeader';
import HeaderComponent from './components/headers/HeaderComponent';

import "./config";

import { Routes, Route, Outlet, Link } from "react-router-dom";

import CaseCatalog from './pages/CaseCatalog';
import CaseVersions from './pages/CaseVersions';
import CaseDetails from './pages/CaseDetails';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/cloud-pak-poc" element={<Layout />}>
          <Route index element={<CaseCatalog />} />
          <Route path="/cloud-pak-poc/case/:name" element={<CaseVersions />} />
          <Route path="/cloud-pak-poc/case/:name/:version" element={<CaseDetails />} />
          <Route path="/cloud-pak-poc/about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Using path="*"" means "match anything", so this route
            acts like a catch-all for URLs that we don't have explicit
            routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );

}

function Layout() {
  return (
    <>
      <Helmet>
        <title>Case2App</title>
      </Helmet>
      <MainHeader />
      <Content>
        <Theme theme="g100">
          <HeaderComponent />
       </Theme>
        <Outlet />
      </Content>
      {/* <DataTable /> */}
    </>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the repository page</Link>
      </p>
    </div>
  );
}

export default App;
