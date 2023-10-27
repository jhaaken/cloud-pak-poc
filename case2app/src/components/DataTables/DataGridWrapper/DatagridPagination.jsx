/* eslint-disable import/prefer-default-export */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
import { Pagination } from "@carbon/react";
import React from "react";

export const DatagridPagination = ({ state, setPageSize, gotoPage, rows }) => {
  const updatePagination = ({ page, pageSize }) => {
    console.log(state);
    setPageSize(pageSize);
    gotoPage(page - 1); // Carbon is non-zero-based
  };

  return (
    <Pagination
      page={state.pageIndex + 1} // react-table is zero-based
      pageSize={state.pageSize}
      pageSizes={state.pageSizes || [10, 20, 30, 40, 50]}
      totalItems={rows.length}
      backwardText="Previous page"
      forwardText="Next page"
      onChange={updatePagination}
    />
  );
};
