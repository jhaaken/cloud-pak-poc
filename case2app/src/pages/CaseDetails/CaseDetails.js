import React from "react";
import { Link, useLocation, generatePath, useParams } from 'react-router-dom';
import yaml from 'js-yaml';
import ReactJsonView from 'react-json-view';

import { Breadcrumb, BreadcrumbItem } from "@carbon/react";
import useGitHubApi from './../../hooks/useGitHubApi';

import case2appData from './../../data/repo/case/ibm-ads/case2app.json';

function CaseDetails() {

  const { name, version } = useParams();

  const ghData = useGitHubApi(`GET /repos/{owner}/{repo}/contents/repo/case/${name}/${version}/version.yaml`,
    { owner: 'IBM', repo: 'cloud-pak' },
    {
      massage: (d) => {
        const decoded = atob(d.content);
        // console.log(decoded);
        const j = yaml.load(decoded);
        return j
      }
    }, ''
  )

  return (
    <>
    <div style={{ marginBottom: "1em" }}>
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem href={"/cloud-pak-poc/"}>home</BreadcrumbItem>
        <BreadcrumbItem href={`/cloud-pak-poc/case/${name}`}>{name}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage={true}>{version}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div>
    <h2>CASE: {name}</h2>
        <h4>{version}</h4>

        <div style={{marginTop: "1em"}}>

        </div>

      <ReactJsonView src={ghData.payload} />
    </div>
      </>
  )
}

export default CaseDetails;