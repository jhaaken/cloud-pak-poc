import React, {useState} from "react";
import { Button, TableToolbarContent, TableToolbarSearch, Tabs, TabList, Tab } from "@carbon/react";
import { CSVLink } from 'react-csv';
import useToggle from './../../../hooks/useToggle';

import {
  Add,
  ChevronDown,
  Download,
  Filter,
  Restart,
  Debug
} from '@carbon/react/icons';
import { Tearsheet } from "@carbon/ibm-products/lib/components";
import ReactJson from "react-json-view";

const DebugTearsheet = ({data, open, setClosed}) => {
  console.log('DebugTearsheet', {data, open, setClosed})
  return (
    <Tearsheet
      open={open ? true : false}
      actions={[]}
      closeIconDescription="Close"
      description="raw data view of the source data in json or yaml"
      hasCloseIcon
      // headerActions={<ButtonSet><Button kind="secondary" size="sm" style={{width: 'initial'}}>Secondary</Button><Button kind="primary" size="sm" style={{width: 'initial'}}>Primary</Button></ButtonSet>}
      // influencer={<div className="tearsheet-stories__dummy-content-block">Influencer</div>}
      // influencerPosition="left"
      // influencerWidth="narrow"
      label="The label of the tearsheet"
      navigation={<div className="tearsheet-stories__tabs"><Tabs onChange={function noRefCheck(){}}><TabList aria-label="Tab list"><Tab>json</Tab><Tab>yaml</Tab></TabList></Tabs></div>}
      onClose={() => setClosed}
      title="Raw Data View"
      >
        <div style={{margin: '1em'}}>
         <ReactJson src={data}/> 
        </div>
      {/*
       TODO: add view of the .yaml file 
      https://react.carbondesignsystem.com/?path=/docs/components-tabs--overview
      */}
    </Tearsheet>
  )
}

const getCache = (key) => {
  try {
    const d = JSON.parse(sessionStorage.getItem(key));
    d.data = JSON.parse(atob(d.b64data));
    return d;
  } catch (error) {
    console.error(`[useGitHubApi] error retrieving, decoding or parsing cache key ${key} from sessionStorage`)
    return '';
  }
}

export const DatagridActions = (datagridState) => {
  const { setGlobalFilter, filterProps, getFilterFlyoutProps, FilterFlyout,
    RowSizeDropdown, rowSizeDropdownProps, refreshDataTrigger = '', rows, headers, debug } = datagridState;

  const [debugData, setDebugData] = useState(getCache(debug.cacheKey));
  const [isTearsheetOpen, toggleTearsheet] = useToggle(false);

  const refreshData = () => {
    if (refreshDataTrigger && typeof refreshDataTrigger === 'function') {
      refreshDataTrigger(new Date());  // call provided state function with timestamp to trigger hook to refresh data
    }
  };

  const searchForAColumn = "Search";

  const style = {
    'button:nthChild(1) > span:nthChild(1)': {
      bottom: '-37px',
    },
  };

  const renderFilterFlyout = () =>
    filterProps?.variation === "flyout" && (
      <FilterFlyout {...getFilterFlyoutProps()} />
    );

  return (
    <>
      <TableToolbarContent>
        <TableToolbarSearch
          size="md"
          id="columnSearch"
          persistent
          placeholdertext={searchForAColumn}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        {refreshDataTrigger ?
          <div style={style} >
            <Button
              kind="ghost"
              hasIconOnly
              tooltipPosition="bottom"
              renderIcon={Restart}
              iconDescription={'Refresh'}
              onClick={refreshData}
            />
          </div>
          : null}
        <div style={style}>
          <CSVLink
            className="bx--toolbar-action"
            id="csv-download"
            key="csv-download"
            data={rows?.map(x => {
              return x?.values
            }) || []}
            headers={headers?.map(x => x?.id) || []}
            filename={`case2app-repo-${new Date().toLocaleString()}.csv`}
          >
            <Button
              kind="ghost"
              hasIconOnly
              tooltipPosition="bottom"
              renderIcon={Download}
              iconDescription={'Download CSV'}
              onClick={() => {
                console.log('Download', { rows, headers })
                console.log('Download-2', {
                  rows: rows.map(x => x.id), headers: headers.map(x => x.values)
                })
              }}
            />
          </CSVLink>
        </div>
        <div style={style}>
          <Button
            kind="ghost"
            hasIconOnly
            tooltipPosition="bottom"
            renderIcon={Debug}
            iconDescription={'Debug'}
            onClick={toggleTearsheet}
          />
        </div>
        <RowSizeDropdown {...rowSizeDropdownProps} />
        {/* example of how to add menu buttons */}
        {/* <MenuButton
            label="Primary button"
            className={`${blockClass}__toolbar-options`}
          >
            <MenuItem
              label="Option 1"
              onClick={action(`Click on ButtonMenu Option 1`)}
            />
            <MenuItem
              label="Option 2"
              onClick={action(`Click on ButtonMenu Option 2`)}
            />
            <MenuItem
              label="Option 3"
              onClick={action(`Click on ButtonMenu Option 3`)}
            />
          </MenuButton> */}
        <Button>Search</Button>
        {renderFilterFlyout()}

      </TableToolbarContent>

      <DebugTearsheet data={debugData} open={isTearsheetOpen} setClosed={toggleTearsheet}/>
    </>
  );
};

