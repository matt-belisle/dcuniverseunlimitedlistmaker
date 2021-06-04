import { useMemo, useReducer } from "react";
import DataGrid from "react-data-grid";
import { ComicRow, createTestRows } from "./Comic";
import { CellExpanderFormatter } from "./Formatters/CellExpanderFormatter";
import type { Column } from "react-data-grid";

interface Action {
  type: "toggleSubRow" | "selectSubRow";
  requested: string;
}

function StringArrayFormatter({ arr }: { arr: string[] }) {
  return <>{arr.join(", ")}</>;
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
    case "toggleSubRow":
      return toggleSubRow(rows, requested);
    case "selectSubRow":
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
        key: "requested",
        name: "Requested Comic",
        frozen: true,
        //I want this to have three options
        //A we have one child -> need browse, 
        //B we have many children -> need to show a tree grid
        //C we have no children -> need to show a browse window
        formatter({ row, isCellSelected }) {
          const hasChildren = row.children !== undefined;
          const style = !hasChildren ? { marginLeft: 30 } : undefined;
          if (hasChildren) {
            return (
              <>
                <CellExpanderFormatter
                  isCellSelected={isCellSelected}
                  isExpanded={row.isExpanded === true}
                  onCellExpand={() =>
                    dispatch({
                      requested: row.requested as string,
                      type: "toggleSubRow",
                    })
                  }
                />
                <div style={style}>{row.requested}</div>
              </>
            );
          } else {
            return <></>;
          }
        },
      },
      {
        key: "SeriesName",
        name: "Series",
      },
      {
        key: "ReleaseDate",
        name: "Release Date",
      },
      {
        key: "IssueNumber",
        name: "Issue Number",
      },
    ];
  }, []);

  return (
    <div>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
