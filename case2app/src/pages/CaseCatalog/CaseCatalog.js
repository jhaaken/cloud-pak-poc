import React, { useEffect, useState } from 'react';
import yaml from 'js-yaml';
import ReactJsonView from 'react-json-view';

import useGitHubApi from './../../hooks/useGitHubApi';
import { DataTableCarbon } from '../../components/DataTables';
import { Breadcrumb, BreadcrumbItem, DataTableSkeleton } from '@carbon/react';

const CaseCatalog = () => {

  const ghData = useGitHubApi('GET /repos/{owner}/{repo}/contents/repo/case/index.yaml',
    {owner: 'IBM',repo: 'cloud-pak'},
    {
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
    }, ''
  )

  const headers = [
    {key: 'name', header: 'Case', isSortable: true, link: (row, cell) => {
      const v = cell?.id.split(':').shift();
      return `case/${v}`
    }},
    {key: 'latestVersion', header: 'Latest Case Version'},
    {key: 'latestAppVersion', header: 'LatestApp Version'},
  ]

  return (
    <>
    {/* <div style={{marginBottom: ".5em"}}>
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem href={"/"} isCurrentPage={true}>home</BreadcrumbItem>
      </Breadcrumb>
    </div> */}
      <div>
      { ghData?.status === 'fetched' ? 
        <DataTableCarbon rows={ghData.payload} headers={headers} /> : 
        <DataTableSkeleton headers={headers} aria-label="case2app" /> }

      </div>
      {/* <div>
        <ReactJsonView src={ghData?.payload} />
      </div> */}
    </>

  )
}

export default CaseCatalog