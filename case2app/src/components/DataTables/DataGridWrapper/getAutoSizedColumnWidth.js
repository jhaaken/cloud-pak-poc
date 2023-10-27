/* eslint-disable import/prefer-default-export */
/**
 * Calculates the auto sized width of a column
 * @param {Array<object>} rows - The datagrid rows
 * @param {string} accessor - The accessor for the column
 * @param {string} headerText - The header text for the column
 */

export const getAutoSizedColumnWidth = (rows, accessor, headerText) => {
  const maxWidth = 500;
  const minWidth = 58;
  const letterSpacing = 10;
  const cellLength = Math.max(
    ...rows.map((row) => (`${row[accessor]}` || '').length),
    headerText.length,
  );
  if (cellLength <= 3) {
    return minWidth;
  }
  return Math.min(maxWidth, cellLength * letterSpacing + 30);
};
