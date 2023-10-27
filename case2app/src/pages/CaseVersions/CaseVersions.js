import React, {useMemo} from "react";
import { Link, useLocation, generatePath, useParams } from 'react-router-dom';
import semver from 'semver/preload.js';
import DataGridWrapper from '../../components/DataTables/DataGridWrapper';

import { DataTableCarbon } from "../../components/DataTables";
// import TableGrid from "../../components/TableGrid/TableGrid";
import case2appData from "./../../data/repo/case/ibm-ads/case2app.json"

import { Breadcrumb, BreadcrumbItem, UnorderedList, ListItem, CopyButton } from "@carbon/react";

import { copyTextToClipboard } from './../../utils';

function CaseVersions() {

  const ghData = {};
  const { name } = useParams();
  // console.log('CaseVersion: ', case2appData);
  const latestAppVersion = case2appData?.latestAppVersion;
  const latestCaseVersion = case2appData?.latestVersion; 

  const rowData = Object.keys(case2appData?.versions).map(x => {
    const item = case2appData.versions[x];
    return {
      ...item,
      id: `${name}/${x}`,
      version: x,
      // airgap: item.airgap.join(',')
    }
  }).sort((a, b) => {return semver.gte(b.version, a.version)})

  const headers = useMemo(() => [
    {accessor: 'displayName', Header: 'Name', width: 240, multiLineWrap: true},
    {accessor: 'appVersion', Header: 'App Version', width: 150},
    {accessor: 'version', Header: 'Case Version', width: 150,
      Cell: (item) => {
        return (<Link to={`${item.cell.value}`}>{item.cell.value}</Link>)
      },
      sortDescFirst: true, // TODO: how can we sort a column default
    },
    {accessor: 'description', Header: 'Description', multiLineWrap: true, width: 250},
    {accessor: 'airGap', Header: 'Airgap Variables', width:500,
    // multiLineWrap: true,
      Cell: (item) => {
        if (!item.value) return '';
        // if (item.value && !Array.isArray(item)) return item.value;
       return (
          <>
          <UnorderedList>
            {item?.value.map(x=> {
                // return (<ListItem>{x}</ListItem>) 
                return (<>{x}<br /></>)                     
            })}
          </UnorderedList>
          <CopyButton style={{display: 'inline-block', backgroundColor: 'inherit', height: '0'}} feedback={`copied to clipboard!`} iconDescription='Copy to clipboard' onClick={async () => {
            await copyTextToClipboard(item.value.join('\r\n'))
          }} />
          </>
        )
      }
    }
  ])

  return (
    <>
    <div style={{marginBottom: "1em"}}>
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem href={"/cloud-pak-poc"}>repository</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage={true}>{name}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div>
        <h2>CASE: {name}</h2>
        {/* <h4>case versions</h4> */}
        <h4>latest case: {latestCaseVersion}  |  latest app: {latestAppVersion}</h4>

        <div style={{marginTop: "1em"}}>
          {/* <DataTableCarbon rows={rowData} headers={headers} />
           */}
          <DataGridWrapper 
            rows={rowData} 
            headers={headers}
            // gridTitle="Case Catalog"
            gridDescription={`${new Date(ghData?.payload?.fetchTimestamp).toLocaleString()} (${ghData?.payload?.fetchMode || '???'})`}
            // options={{refreshDataTrigger: setRefreshTimestamp}}
          />
        </div>

      </div></>
  )
}

export default CaseVersions;