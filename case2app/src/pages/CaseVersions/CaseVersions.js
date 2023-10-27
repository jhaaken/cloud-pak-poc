import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useParams } from 'react-router-dom';
import semver from 'semver/preload.js';
import yaml from 'js-yaml';
import DataGridWrapper from '../../components/DataTables/DataGridWrapper';
// import case2appData from "./../../data/repo/case/ibm-ads/case2app.json"

import {
  Breadcrumb, BreadcrumbItem, UnorderedList, ListItem, CopyButton,
  Tab, Tabs, TabPanel, TabPanels, TabList
} from "@carbon/react";

import { copyTextToClipboard } from './../../utils';
import useGitHubApi from "../../hooks/useGitHubApi";

function CaseVersions() {

  const ghData = {};
  const { name } = useParams();

  const case2appDataRef = useRef({});
  const [rowData, setRowData] = useState([]);

  const getData = async (caseName) => {

    // data is in public directory for demo/poc
    return fetch(`${process.env.PUBLIC_URL}/ibm/cloud-pak/repo/case/${caseName}/case2app.json`, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        case2appDataRef.current = jsonData
      })
      .catch(e => {
        console.log('CaseVersion: fetch:error', { msg: e.message, stack: e.stack })
      })
  }

  useEffect(() => {
    getData(name)
      .then(resp => {
        const latestAppVersion = case2appDataRef.current?.latestAppVersion;
        const latestCaseVersion = case2appDataRef.current?.latestVersion;
        console.log('useEffect', { resp, ref: case2appDataRef.current })
        const d = Object.keys(case2appDataRef.current?.versions).map(x => {
          const item = case2appDataRef.current.versions[x];
          return {
            ...item,
            id: `${name}/${x}`,
            version: x,
            // airgap: item.airgap.join(',')
          }
        }).sort((a, b) => { return semver.gte(b.version, a.version) })
        setRowData(d);
      })
  }, [name])

  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date());

  const ghDataResources = useGitHubApi(`GET /repos/{owner}/{repo}/contents/repo/case/${name}/resourcesIndex.yaml`,
    { owner: 'IBM', repo: 'cloud-pak' },
    {
      useCache: true,
      cacheKey: `case2app:github.com/repos/IBM/cloud-pak/contents/repo/case/${name}/resourcesIndex.yaml`,
      massage: (d) => {
        const decoded = atob(d.content);
        // console.log(decoded);
        const j = yaml.load(decoded);
        return j.containerImages.map(x => {
          return {
          ...x,
          imageFull: `${x.image}@${x.digest}`
          }
        });
      }
    },
    refreshTimestamp
  )

  const versionHeaders = useMemo(() => [
    { accessor: 'displayName', Header: 'Name', width: 240, multiLineWrap: true },
    { accessor: 'appVersion', Header: 'App Version', width: 150 },
    {
      accessor: 'version', Header: 'Case Version', width: 150,
      Cell: (item) => {
        return (<Link to={`${item.cell.value}`}>{item.cell.value}</Link>)
      },
      sortDescFirst: true, // TODO: how can we sort a column default
    },
    { accessor: 'description', Header: 'Description', multiLineWrap: true, width: 250 },
    {
      accessor: 'airGap', Header: 'Airgap Variables', width: 500,
      // multiLineWrap: true,
      Cell: (item) => {
        if (!item.value) return '';
        // if (item.value && !Array.isArray(item)) return item.value;
        return (
          <>
            <UnorderedList>
              {item?.value.map(x => {
                // return (<ListItem>{x}</ListItem>) 
                return (<>{x}<br /></>)
              })}
            </UnorderedList>
            <CopyButton style={{ display: 'inline-block', backgroundColor: 'inherit', height: '0' }} feedback={`copied to clipboard!`} iconDescription='Copy to clipboard' onClick={async () => {
              await copyTextToClipboard(item.value.join('\r\n'))
            }} />
          </>
        )
      }
    }
  ])

  const resourceHeaders = useMemo(() => [
    // { accessor: "id", Header: "id", width: 50,}
    { accessor: "imageFull", Header: "Image", width: 500,
      Cell: (item) => {
        // console.log('digestShort', {item});
        if (!item.value) return '';
        return (
          <>
            <CopyButton style={{ display: 'inline-block', backgroundColor: 'inherit', height: '0' }} feedback={`copied to clipboard!`} iconDescription={`Copy to clipboard`} onClick={async () => {
              await copyTextToClipboard(item.value)
            }} />
            <span style={{paddingRight: '.25em'}} title={`${item.value}`}>{item.value}</span>
          </>
        )
      }
  
    },
    // { accessor: "digestShort", Header: "Digest", width: 150,
    //   Cell: (item) => {
    //     console.log('digestShort', {item});
    //     if (!item.value) return '';
    //     return (
    //       <>
    //         <span style={{paddingRight: '.25em'}} title={`${item.value.f}`}>{item.value.s}</span>
    //         <CopyButton style={{ display: 'inline-block', backgroundColor: 'inherit', height: '0' }} feedback={`copied to clipboard!`} iconDescription={`Copy to clipboard: ${item.value.f}`} onClick={async () => {
    //           await copyTextToClipboard(item.value.f)
    //         }} />
    //       </>
    //     )
    //   }
    // },

    { accessor: "tag", Header: "Tag" ,  width: 200},
    { accessor: "category", Header: "Category" },
    { accessor: "caseVersions", Header: "CASE Versions" },
    // { accessor: "digest", Header: "Digest" ,  isVisible: false},
  ])

  // TODO: add filters for case version to limit resources be version
  const resourceFilterProps = useMemo(() => {
    const filters = {
      // TODO: see example filters in DatagridWrapper
    };
    return  {
        variation: "flyout", // default
        updateMethod: "batch", // default
        primaryActionLabel: "Apply", // default
        secondaryActionLabel: "Cancel", // default
        flyoutIconDescription: "Open filters", // default
        shouldClickOutsideToClose: false, // default
        filters
      }
  })

  return (
    <>
      <div style={{ marginBottom: "1em" }}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href={"/cloud-pak-poc"}>repository</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage={true}>{name}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div>
        <h2>CASE: {name}</h2>
        {/* <h4>case versions</h4> */}
        <h4>latest app: {case2appDataRef.current?.latestAppVersion}  |  latest case: {case2appDataRef.current?.latestVersion} </h4>
        <div style={{ "marginTop": "1em" }}>
          <Tabs>
            <TabList aria-label="List of tabs">
              <Tab>Versions</Tab>
              <Tab>Resources</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div style={{ marginTop: "1em" }}>
                  <DataGridWrapper
                    rows={rowData}
                    headers={versionHeaders}
                    gridTitle="Versions"
                    // gridDescription={`${new Date(ghData?.payload?.fetchTimestamp).toLocaleString()} (${ghData?.payload?.fetchMode || '???'})`}
                  // options={{refreshDataTrigger: setRefreshTimestamp}}
                  />
                </div>
              </TabPanel>
              <TabPanel>
                {ghDataResources?.status === 'fetched' ?
                  <DataGridWrapper
                    rows={ghDataResources?.payload?.data}
                    headers={resourceHeaders}
                    gridTitle="Resources (resourceIndex.yaml)"
                    gridDescription={`${new Date(ghDataResources?.payload.fetchTimestamp).toLocaleString()} (${ghDataResources?.payload.fetchMode || '???'})`}
                    multiLineWrapAll={true}
                    options={{
                      refreshDataTrigger: setRefreshTimestamp,
                      debug: { cacheKey: `case2app:github.com/repos/IBM/cloud-pak/contents/repo/case/${name}/resourcesIndex.yaml` }
                    }}
                  />
                  : null
                }

              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>



      </div></>
  )
}

export default CaseVersions;