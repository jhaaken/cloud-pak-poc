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
  Pagination,

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
  // pagination controls
  // const [firstRowIndex, setFirstRowIndex] = useState(0);
  // const [currentPageSize, setCurrentPageSize] = useState(25);
  // rows.slice(firstRowIndex, firstRowIndex + currentPageSize)

  const { fetchTimestamp = '', fetchMode = ''} = options || {};

  return (
    <>    
      {/* <span>{new Date(fetchTimestamp).toLocaleString()} {`(${fetchMode})`}</span> */}
      <DataTable rows={rows} headers={headers} 
        isSortable={true} 
        size={"md"} 
        {...options.dataTable || {}}>
          {({
            rows, headers, getHeaderProps, getRowProps, getTableProps, getToolbarProps, getTableContainerProps, onInputChange,
          }) => <TableContainer stickyHeader={true} title={"CASE Catalog"} description={`${new Date(fetchTimestamp).toLocaleString()} (${fetchMode || '???'})`} {...getTableContainerProps()}>
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
                        // console.log('DataTable', { row, cell });
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
      {/* <Pagination
        totalItems={rows.length}
        backwardText="Previous page"
        forwardText="Next page"
        pageSize={currentPageSize}
        pageSizes={[5, 10, 15, 25, 50]}
        itemsPerPageText="Items per page"
        onChange={({ page, pageSize }) => {
          if (pageSize !== currentPageSize) {
            setCurrentPageSize(pageSize);
          }
          setFirstRowIndex(pageSize * (page - 1));
        }}
      /> */}
    </>
    )

}

export default DataTableCarbon;
