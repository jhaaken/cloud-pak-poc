import React, { useState, useMemo } from "react";
import { useParams } from 'react-router-dom';
import yaml from 'js-yaml';
import ReactJsonView from 'react-json-view';
import { formatDistanceToNowStrict } from 'date-fns';
import { Restart } from '@carbon/react/icons';

import {
  Breadcrumb, BreadcrumbItem, Tag, Link as CarbonLink,
  Tab, Tabs, TabPanel, TabPanels, TabList, Tile, Button, CopyButton
} from "@carbon/react";

import DataGridWrapper from '../../components/DataTables/DataGridWrapper';
import { copyTextToClipboard } from './../../utils';
import useGitHubApi from './../../hooks/useGitHubApi';

function CaseDetails() {

  const { name, version } = useParams();
  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date());

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
    { accessor: "tag", Header: "Tag" ,  width: 200},
    { accessor: "category", Header: "Category" },
    { accessor: "caseVersions", Header: "CASE Versions" },
    // { accessor: "digest", Header: "Digest" ,  isVisible: false},
  ])

  const ghData = useGitHubApi(`GET /repos/{owner}/{repo}/contents/repo/case/${name}/${version}/version.yaml`,
    { owner: 'IBM', repo: 'cloud-pak' },
    {
      useCache: true,
      cacheKey: `case2app:github.com/repos/IBM/cloud-pak/contents/repo/case/${name}/${version}/version.yaml`,
      massage: (d) => {
        const decoded = atob(d.content);
        // console.log(decoded);
        const j = yaml.load(decoded);
        return j
      }
    },
    refreshTimestamp
  )

  const ghDataResources = useGitHubApi(`GET /repos/{owner}/{repo}/contents/repo/case/${name}/resourcesIndex.yaml`,
  { owner: 'IBM', repo: 'cloud-pak' },
  {
    useCache: true,
    cacheKey: `case2app:github.com/repos/IBM/cloud-pak/contents/repo/case/${name}/resourcesIndex.yaml`,
    massage: (d) => {
      const decoded = atob(d.content);
      // console.log(decoded);
      const j = yaml.load(decoded);
      return j.containerImages
        .map(x => {
        return {
        ...x,
        imageFull: `${x.image}@${x.digest}`
        }
        });
    }
  },
  refreshTimestamp
)

  console.log('ghData.payload', {ghData: ghData?.payload?.data, ghDataResources: ghDataResources?.payload?.data})

  return (
    <>
      <div style={{ marginBottom: "1em" }}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href={"/cloud-pak-poc/"}>repository</BreadcrumbItem>
          <BreadcrumbItem href={`/cloud-pak-poc/case/${name}`}>{name}</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage={true}>{version}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div>
        <h2>CASE: {name} - {version} </h2>
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
        <div style={{ "marginTop": "1em" }}>
          <Tabs>
            <TabList aria-label="List of tabs">
              <Tab>Details</Tab>
              <Tab>Resources</Tab>
              <Tab>Raw</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div style={{ marginTop: "1em" }}>
                  {ghData.status === 'fetched' ?
                    <>
                      <h4 style={{ padding: ".5em" }}>{ghData.payload.data.case.displayName} ({ghData.payload.data.case.appVersion}) </h4>
                      <div style={{ padding: ".5em" }}>{ghData.payload.data.case.description}</div>
                      <div style={{ padding: ".5em" }}>
                        <CarbonLink href={ghData.payload?.data.case.webPage}>{ghData.payload?.data.case.webPage} </CarbonLink>
                      </div>
                      <div style={{ padding: ".5em" }}>
                        created: <span title={`locale: ${new Date(ghData.payload?.data.created).toLocaleString(undefined, {timeZoneName: "short"})}`}>{ghData.payload?.data.created}</span>
                        <span style={{ marginLeft: '.5em' }}>({formatDistanceToNowStrict(new Date(ghData.payload?.data.created))} ago)</span>
                      </div>
                      <div style={{ padding: ".5em" }}>
                        digest: {ghData.payload?.data.digest}
                      </div>

                      <div style={{ marginTop: "1em", display: "flex", flexWrap: "wrap", gap: "1em" }}>
                        <Tile>
                          <div style={{ padding: ".5em" }}>
                            <h5 style={{ marginBottom: "1em" }}>catalogs</h5>
                            <div>
                              {Object.keys(ghData.payload?.data.case.catalogs).map(x => {
                                return (<Tag type="blue" title={x}> {x} </Tag>)
                              })}
                            </div>
                          </div>
                        </Tile>
                        <Tile>
                          <div style={{ padding: ".5em" }}>
                            <h5 style={{ marginBottom: "1em" }}>architectures</h5>
                            <div>
                              {Object.keys(ghData.payload?.data.case.supports.architectures).map(x => {
                                return (<Tag type="magenta" title={x}> {x} </Tag>)
                              })}
                            </div>
                          </div>
                        </Tile>
                        <Tile>
                          <div style={{ padding: ".5em" }}>
                            <h5 style={{ marginBottom: "1em" }}>k8sDistros</h5>
                            <div>
                              {Object.keys(ghData.payload?.data.case.supports.k8sDistros).map(x => {
                                return (<Tag type="grey" title={x}> {x} </Tag>)
                              })}
                            </div>
                          </div>
                        </Tile>
                        <Tile>
                          <div style={{ padding: ".5em" }}>
                            <h5 style={{ marginBottom: "1em" }}>classifications</h5>
                            <div>
                              {Object.keys(ghData.payload?.data.case.classifications).map(x => {
                                return (<Tag type="green" title={x}> {x} </Tag>)
                              })}
                            </div>
                          </div>
                        </Tile>
                        <Tile>
                          <div style={{ padding: ".5em" }}>
                            <h5 style={{ marginBottom: "1em" }}>licenses</h5>
                            <div>
                              <>
                                {Object.keys(ghData.payload?.data.case.licenses).map(x => {
                                  const item = ghData.payload?.data.case.licenses[x];
                                  return (
                                    <>
                                      <div style={{ display: "flex" }} >
                                        <Tile>
                                          <div style={{ borderStyle: '1px dotted grey' }}>
                                            <Tag type="cyan" title={x}> {x} </Tag>
                                            <div>{item.metadata.displayName}</div>
                                            <div>{item.metadata.displayDescription}</div>
                                          </div>
                                        </Tile>
                                      </div>
                                    </>
                                  )
                                })}
                              </>
                            </div>
                          </div>
                        </Tile>
                      </div>


                    </> : null}
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{ marginTop: "1em" }}>
                <div>filtered to case version {version}</div>
                {ghDataResources?.status === 'fetched' ?
                  <DataGridWrapper
                    rows={ghDataResources?.payload?.data.filter(x => {return x.caseVersions.includes(version)} )}
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
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{ marginTop: "1em" }}>
                  {ghData?.status === 'fetched' ?
                    <ReactJsonView src={ghData.payload} />
                    : null
                  }
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

      </div>
    </>
  )
}

export default CaseDetails;