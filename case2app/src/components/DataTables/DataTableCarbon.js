import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

import {
  Grid, Column,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  UnorderedList,
  ListItem,

} from '@carbon/react';

const CreateList = ({data}) => {
  return (
    <UnorderedList>
      {data?.map(x=> {
          // return (<ListItem>{x}</ListItem>) 
          return (<>{x}<br /></>)                     
      })}
    </UnorderedList>
  )
}

const DataTableCarbon = ({ rows, headers, options }) => {

  console.log('DataTableCarbon', { rows, headers })

  const { rowOnClick = '' } = options || {};

  return (
    <>    
      <DataTable rows={rows} headers={headers}>
          {({
            rows, headers, getHeaderProps, getRowProps, getTableProps, getToolbarProps, getTableContainerProps, onInputChange,
          }) => <TableContainer {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} defaultExpanded={true} expanded={true} />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => {
                        console.log('DataTable', { row, cell });
                        const headerProps = headers.find(x => x.key === cell.info.header);
                        const v = Array.isArray(cell.value) ? <CreateList data={cell.value} /> : cell.value;
                        if (headerProps.link && typeof headerProps.link === 'function') {
                          const alink = headerProps.link(row, cell);
                          return (<TableCell key={cell.id}><Link to={alink}>{cell.value}</Link></TableCell>);
                        } else {
                          return (<TableCell key={cell.id}>{v}</TableCell>);
                        }
                      }
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>}

      </DataTable>
    </>
    )

}

export default DataTableCarbon;
