import React, {useMemo} from "react";
import { Link, useLocation, generatePath, useParams } from 'react-router-dom';


import { DataTableCarbon } from "../../components/DataTables";
// import TableGrid from "../../components/TableGrid/TableGrid";
import case2appData from "./../../data/repo/case/ibm-ads/case2app.json"

import { Breadcrumb, BreadcrumbItem } from "@carbon/react";

function CaseVersions() {

  const { name } = useParams();
  console.log('CaseVersion: ', case2appData);
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
  }).sort((a, b) => {return b.id - a.id})
  const headers = useMemo(() => [
    {key: 'displayName', header: 'Name'},
    {key: 'appVersion', header: 'App Version'},
    {key: 'version', header: 'Case Version', 
      link: (row, cell) => {
        return cell?.value;
    }},
    {key: 'description', header: 'Description'},
    {key: 'airGap', header: 'Airgap Variables'}
  ])

  return (
    <>
    <div style={{marginBottom: "1em"}}>
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem href={"/cloud-pak-poc"}>home</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage={true}>{name}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div>
        <h2>CASE: {name}</h2>
        <h4>case versions</h4>

        <div style={{marginTop: "1em"}}>
          <DataTableCarbon rows={rowData} headers={headers} />
        </div>
        {/* <div>
    {dataMemo.isDataReady ?
      <TableGrid
        columnSource={dataMemo.columnSource}
        data={dataMemo.data}
        options={{ useDataHeight: true, skipLocationUpdate: true }}
      />
    : null}

    </div> */}
      </div></>
  )
}

export default CaseVersions;