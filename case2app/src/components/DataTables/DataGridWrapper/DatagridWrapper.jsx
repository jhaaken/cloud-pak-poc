import React, { useState } from "react";

import {
  Datagrid,
  useDatagrid,
  useFiltering,
  useSortableColumns,
  pkg,
} from "@carbon/ibm-products";

import { DatagridPagination } from "./DatagridPagination";
import { DatagridActions } from "./DatagridActions";

// example how to create filters
// const filters = [
//   {
//     type: "radio",
//     column: "name",
//     props: {
//       FormGroup: {
//         legendText: "name",
//       },
//       RadioButtonGroup: {
//         orientation: "vertical",
//         legend: "name",
//         name: "name-radio-button-group",
//       },
//       RadioButton: [
//         {
//           id: "Direct",
//           labelText: "Direct",
//           value: "Direct",
//         },
//         {
//           id: "Conditional",
//           labelText: "Conditional",
//           value: "Conditional",
//         },
//         {
//           id: "Equivalent",
//           labelText: "Equivalent",
//           value: "Equivalent",
//         },
//       ],
//     },
//   },
// ];

export const DatagridWrapper = ({ rows, headers, gridTitle, gridDescription, options }) => {
 
  const emptyStateTitle = "Part Substitutions";
  const emptyStateDescription = "No data found";
  const emptyStateSize = "lg";
  const emptyStateType = "noData";
  const columns = React.useMemo(() => [...headers], [rows]);

  const {refreshDataTrigger = '', debug = ''} = options || {};

  const datagridState = useDatagrid(
    {
      columns,
      data: rows,
      gridTitle,
      gridDescription,
      debug,
      initialState: {
        page: 0,
        pageSize: 25,
        pageSizes: [10, 25, 50, 100, 500],
      },
      refreshDataTrigger: refreshDataTrigger,
      DatagridPagination,
      DatagridActions,
      // filterProps: {
      //   variation: "flyout", // default
      //   updateMethod: "batch", // default
      //   primaryActionLabel: "Apply", // default
      //   secondaryActionLabel: "Cancel", // default
      //   flyoutIconDescription: "Open filters", // default
      //   shouldClickOutsideToClose: false, // default
      //   filters,
      // },
      onColResizeEnd: (currentColumn, allColumns) => console.log(currentColumn, allColumns),
      emptyStateTitle,
      emptyStateDescription,
      emptyStateSize,
      emptyStateType,
    },
    // useFiltering,
    useSortableColumns
  );

  pkg.feature["Datagrid.useFiltering"] = true;
  console.log('DataGridState', datagridState);

  return <Datagrid datagridState={{ ...datagridState }} />;
};

