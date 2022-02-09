import React, { useState, useEffect } from "react";
import { Container, Pagination, Table, Icon } from "semantic-ui-react";

const PAGESIZE = 5;

/**
 * PaginationTable wrapper for if the full data is already in memory
 * @param {array} fulldata     array of arrays, where first array hold the column names
 */
export default function FullDataTable({ fullData }) {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [columns, setColumns] = useState(null);

  const pageChange = (activePage) => {
    const offset = (activePage - 1) * PAGESIZE;
    const newdata = fullData.slice(offset, offset + PAGESIZE);
    setData(newdata);
  };

  useEffect(() => {
    if (!fullData) {
      setData([]);
      return null;
    }
    setColumns(null);

    const n = fullData.length;
    setPages(Math.ceil(n / PAGESIZE));
    let newdata = [];
    if (n > 0) newdata = fullData.slice(0, PAGESIZE);
    setData(newdata);

    // get all columns used in data, so that table shows them if missing in a batch
    const columnMap = {};
    for (let r of fullData) {
      for (let column of Object.keys(r)) {
        if (!columnMap[column]) columnMap[column] = true;
      }
    }
    setColumns(Object.keys(columnMap));
  }, [fullData]);

  if (!data || data.length === 0 || !columns || columns.length === 0) return null;

  return <PaginationTable data={data} pages={pages} columns={columns} pageChange={pageChange} />;
}

/**
 * A nice table with pagination
 * @param {array} data    An array of arrays with data
 * @param {array} columns an Array of column names
 * @param {int} pages the number of pages
 * @returns
 */
const PaginationTable = ({ data, columns, pages, pageChange }) => {
  const createHeaderRow = (data, columns) => {
    return columns.map((col, i) => {
      return (
        <Table.HeaderCell key={i}>
          <span>{col}</span>
        </Table.HeaderCell>
      );
    });
  };

  const createBodyRows = (data) => {
    return data.map((row, i) => {
      return <Table.Row key={i}>{createRowCells(row)}</Table.Row>;
    });
  };

  const createRowCells = (row) => {
    let cells = columns.map((column, i) => {
      const isObject = typeof row[column] === "object";
      const value = isObject ? JSON.stringify(row[column]) : row[column];
      return (
        <Table.Cell key={i}>
          <span title={value}>{value}</span>
        </Table.Cell>
      );
    });

    return cells;
  };
  if (data.length < 1) return null;

  return (
    <Container style={{ width: "100%" }}>
      <Table
        unstackable
        selectable
        fixed
        compact
        singleLine
        size="small"
        style={{ fontSize: "10px" }}
      >
        <Table.Header>
          <Table.Row>{createHeaderRow(data, columns)}</Table.Row>
        </Table.Header>
        <Table.Body>{createBodyRows(data)}</Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={columns.length}>
              {pages > 1 ? (
                <Pagination
                  size="mini"
                  floated="right"
                  boundaryRange={1}
                  siblingRange={1}
                  ellipsisItem={{
                    content: <Icon name="ellipsis horizontal" />,
                    icon: true,
                  }}
                  firstItem={{
                    content: <Icon name="angle double left" />,
                    icon: true,
                  }}
                  lastItem={{
                    content: <Icon name="angle double right" />,
                    icon: true,
                  }}
                  prevItem={{ content: <Icon name="angle left" />, icon: true }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  pointing
                  secondary
                  defaultActivePage={1}
                  totalPages={pages}
                  onPageChange={(e, d) => pageChange(d.activePage)}
                ></Pagination>
              ) : null}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container>
  );
};