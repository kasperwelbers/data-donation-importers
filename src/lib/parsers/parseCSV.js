export default function parseHTML(content, rows_selector, column_selectors, head = false) {
  if (column_selectors.length === 0) return [];

  const rows = head ? content.slice(0, 50) : content;
  return rows.map((row) => {
    const selectedRow = {};
    for (let column of column_selectors) {
      if (row[column]) selectedRow[column] = row[column];
    }
    return selectedRow;
  });
}
