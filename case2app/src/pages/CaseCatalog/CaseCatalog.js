import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import yaml from 'js-yaml';

import useGitHubApi from './../../hooks/useGitHubApi';
import { DataTableSkeleton, Button, Breadcrumb, BreadcrumbItem } from '@carbon/react';
import { Restart } from '@carbon/react/icons';
import DataGridWrapper from '../../components/DataTables/DataGridWrapper';
import { getAutoSizedColumnWidth } from "./../../components/DataTables/DataGridWrapper/getAutoSizedColumnWidth";

const CaseCatalog = () => {

  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date());

  const ghData = useGitHubApi('GET /repos/{owner}/{repo}/contents/repo/case/index.yaml',
    {owner: 'IBM',repo: 'cloud-pak'},
    {
      useCache: true,
      cacheKey: 'case2app:github.com/repos/IBM/cloud-pak/contents/repo/case/index.yaml',
      massage: (d) => {
        const decoded = atob(d.content);
        // console.log(decoded);
        const j = yaml.load(decoded);

        return Object.keys(j.entries).map(x => {
          const item = j.entries[x];
          return {
            id: x,
            name: x,
            ...item
          }
        })
      }
    }, 
    refreshTimestamp
  )

  // FIXME: using getAutoSize.. needs rows so need to either change the function to give it name & multiplier
  // then in DatagridWrapper it would need cycle every header for this prop to calc the width based on the row
  const headers = [
    {accessor: 'name', Header: 'Case', isSortable: true,
      width: 350, // getAutoSizedColumnWidth(rows, "name", "Name") * 1.1,
      Cell: (d) => {
        // console.log('Datagrid: column', {d})
        return (<Link to={`case/${d.cell.value}`}>{d.cell.value}</Link>)
      }
    },
    {accessor: 'latestVersion', Header: 'Latest Case Version',
      width: 300, // getAutoSizedColumnWidth(rows, "latestVersion", "Latest Case Version")},
    },
    {accessor: 'latestAppVersion', Header: 'Latest App Version',
      width: 300, // getAutoSizedColumnWidth(rows, "latestAppVersion", "Latest App Versio")},
    }
  ]

  return (
    <>
          <div style={{ marginBottom: "1em" }}>
        <Breadcrumb noTrailingSlash>
          {/* <BreadcrumbItem href={"/cloud-pak-poc"}>repository</BreadcrumbItem> */}
          <BreadcrumbItem isCurrentPage={true}>repository</BreadcrumbItem>
        </Breadcrumb>
      </div>
        <h2>CASE Repository</h2>
        <h6 style={{display: "flex", alignItems: 'center'}}>
          <div>
            {ghData.status === 'fetched' ? `${new Date(ghData.payload.fetchTimestamp).toLocaleString()} (${ghData.payload.fetchMode || '???'})` : null}
          </div>
          <div style={{display:"inline"}} >
            <Button
              kind="ghost"
              hasIconOnly
              tooltipPosition="bottom"
              renderIcon={Restart}
              iconDescription={'Refresh'}
              onClick={() => setRefreshTimestamp(new Date())}
            />
          </div>
        </h6>
      <div>
      { ghData?.status === 'fetched' ? 

        <DataGridWrapper 
          rows={ghData.payload?.data} 
          headers={headers}
          // gridTitle="CASE Repository"
          // gridDescription={`${new Date(ghData.payload.fetchTimestamp).toLocaleString()} (${ghData.payload.fetchMode || '???'})`}
          options={{refreshDataTrigger: setRefreshTimestamp, 
            debug: {cacheKey: 'case2app:github.com/repos/IBM/cloud-pak/contents/repo/case/index.yaml'}
          }}
          />
        // <DataTableCarbon rows={ghData.payload?.data} headers={headers} 
        //   options={{fetchTimestamp: ghData.payload.fetchTimestamp, fetchMode: ghData.payload.fetchMode }}/> 
          :
        <DataTableSkeleton headers={headers} aria-label="case2app" /> 
      }

      </div>

      {/* <div>
        <ReactJsonView src={ghData?.payload} />
      </div> */}
    </>

  )
}

export default CaseCatalog