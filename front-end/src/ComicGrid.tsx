import { useState, useReducer, useMemo } from 'react';
import {ComicRow, createTestRows} from './Comic'
import type { Column } from 'react-data-grid'
import DataGrid from 'react-data-grid'


interface Action {
    type: 'toggleSubRow' | 'selectSubRow';
    requested: string;
}

function StringArrayFormatter({arr}: {arr: string[]}){
  return <>{arr.join(', ')}</>
}
/*         
To use
// formatter(props) {
                //   return <StringArrayFormatter arr={props.row.Authors} />
                // }

*/

function toggleSubRow(rows: ComicRow[], requested: string): ComicRow[] {
    const rowIndex = rows.findIndex((r) => r.requested === requested);
    const row = rows[rowIndex];
    const { children } = row;
    //basically if there are no children then this shouldn't have happened anyways
    if (!children) return rows;
  
    const newRows = [...rows];
    newRows[rowIndex] = { ...row, isExpanded: !row.isExpanded };
    if (!row.isExpanded) {
      newRows.splice(rowIndex + 1, 0, ...children);
    } else {
      newRows.splice(rowIndex + 1, children.length);
    }
    return newRows;
  }


  function reducer(rows: ComicRow[], { type, requested }: Action): ComicRow[] {
    switch (type) {
      case 'toggleSubRow':
        return toggleSubRow(rows, requested);
      case 'selectSubRow':
        // return selectSubRow(rows, requested);
      default:
        return rows;
    }
  }

  const defaultRows = createTestRows();


  export default function ComicGrid() {
      const [rows, dispatch] = useReducer(reducer, defaultRows);
      const columns: Column<ComicRow>[] = useMemo(() => {
          return [
              {
                  key: 'requested',
                  name: 'Requested Comic',
                  frozen: true
              },
              {
                key: 'SeriesName',
                name: 'Series'
              },
              {
                key: 'ReleaseDate',
                name: 'Release Date'
              },
              {
                key: 'IssueNumber',
                name: 'Issue Number'
              }
          ]
      }, [])

      return (
          <div>
            <DataGrid columns={columns} rows={rows} />
          </div>
      )
  }