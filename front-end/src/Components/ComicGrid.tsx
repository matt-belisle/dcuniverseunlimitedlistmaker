import { useMemo, useReducer } from "react";
import DataGrid from "react-data-grid";
import { ComicRow, createTestRows, baseComicRow } from "./Comic";
import { CellExpanderFormatter } from "./Formatters/CellExpanderFormatter";
import { CellActionsFormatter } from "./Formatters/CellActionsFormatter";
import type { Column } from "react-data-grid";
//necessary to make things pure for the reducer, was running into issues without this
import { cloneDeep } from "lodash";
interface Action {
  type: "toggleSubRow" | "selectSubRow";
  identifier: string;
}


function toggleSubRow(rows: ComicRow[], requested: string): ComicRow[] {
  const rowIndex = rows.findIndex((r) => r.requested === requested);
  const row = rows[rowIndex];
  const { children } = row;
  //basically if there are no children then this shouldn't have happened anyways
  if (!children) return rows;

  const newRows = cloneDeep(rows);
  newRows[rowIndex] = { ...row, isExpanded: !row.isExpanded };
  if (!row.isExpanded) {
    newRows.splice(rowIndex + 1, 0, ...children);
  } else {
    newRows.splice(rowIndex + 1, children.length);
  }
  return newRows;
}

function selectSubRow(rows: ComicRow[], UUID: string): ComicRow[] {
  const rowIndex = rows.findIndex((r) => r.UUID === UUID);
  let curr = rows[rowIndex].isSelected;
  const newRows = cloneDeep(rows);
  newRows[rowIndex].isSelected = !curr;
  if (curr === false) {
    //go backwards to the previous parent or beginning of list
    let i = rowIndex - 1;
    while (i > 0 && newRows[i].children === undefined) {
      newRows[i].isSelected = false;
      i--;
    }
    //go forwards to next parent or end of list
    i = rowIndex + 1;
    while (i < newRows.length && newRows[i].children === undefined) {
      newRows[i].isSelected = false;
      i++;
    }
  }
  return remapParents(newRows);
}


//note this is not a pure function, so it should not take anything currently in the state.
function remapParents(rows: ComicRow[]): ComicRow[] {
  return rows.map((row: ComicRow) => {
    if (row.children !== undefined) {
      if (row.children.length === 1) {
        return {
          requested: row.requested,
          children: row.children,
          //keeps uuid unique to the child for searching
          ...row.children[0],
          UUID: undefined,
        };
      }
      //if one of the children is selected we should display that on the parent row
      let selected = row.children.find((x) => x.isSelected === true);
      if (selected !== undefined) {
        return {
          requested: row.requested,
          children: row.children,
          //keeps uuid unique to the child for searching,
          ...selected,
          UUID: undefined,
        };
      } else {
        return baseComicRow(
          row.requested,
          row.isSelected,
          row.isExpanded,
          row.children
        );
      }
    }
    return row;
  });
}

//identifier is just something that can uniquely determine the row,
//for parents this is the requested, for children, which are from DB,
//this is the UUID
function reducer(rows: ComicRow[], { type, identifier }: Action): ComicRow[] {
  switch (type) {
    case "toggleSubRow":
      return toggleSubRow(rows, identifier);
    case "selectSubRow":
      console.log("Here");
      return selectSubRow(rows, identifier);
    default:
      return rows;
  }
}

const defaultRows = createTestRows();

export default function ComicGrid() {
  const mappedRows = remapParents(defaultRows);

  const [rows, dispatch] = useReducer(reducer, mappedRows);

  const columns: Column<ComicRow>[] = useMemo(() => {
    return [
      {
        key: "requested",
        name: "Requested Comic",
        frozen: true,
        //I want this to have three options

        //may as well always give browse option, can't hurt.
        //A we have one child -> give the option to browse in case it is wrong
        //B we have many children -> need to show a tree grid, and checkmarks
        //C we have no children -> need to show a browse button as we couldnt find anything
        formatter({ row, isCellSelected }) {
          const hasChildren = row.children !== undefined;
          const style = !hasChildren ? { marginLeft: 30 } : undefined;
          const isParent = row.requested !== undefined;
          if (isParent) {
            if (hasChildren) {
              //TODO add browse here
              const actions = [
                {
                  icon: "🔍",
                  callback() {
                    alert("Browse not implemented yet");
                  },
                },
              ];
              const cellActionsFormatter = (
                <CellActionsFormatter actions={actions} />
              );
              return (
                <>
                  <div className="formatterContainer">
                    {cellActionsFormatter}
                    {row.children!.length > 1 && (
                      <CellExpanderFormatter
                        isCellSelected={isCellSelected}
                        isExpanded={row.isExpanded === true}
                        onCellExpand={() =>
                          dispatch({
                            identifier: row.requested as string,
                            type: "toggleSubRow",
                          })
                        }
                      />
                    )}
                  </div>
                  <div style={style}>{row.requested}</div>
                </>
              );
            } else if (hasChildren && row.children?.length === 1) {
              return <div>{row.requested}</div>;
            }
          } else {
            //so this is a child, as children don't have a requested attribute -- so we need to show a select action

            const actions = [
              {
                icon: row.isSelected ? "☑️" : "🟦",
                callback() {
                  dispatch({
                    identifier: row.UUID as string,
                    type: "selectSubRow",
                  });
                },
              },
            ];

            return (
              <>
                <CellActionsFormatter actions={actions} />
              </>
            );
          }
          return <div>{}</div>;
        },
      },
      {
        key: "SeriesName",
        name: "Series",
        formatter({ row, isCellSelected }) {
          const actions = [
            {
              icon: "❓",
              callback() {
                alert("Information not implemented yet");
              },
            },
          ];
          const needsInfo = row.children === undefined || row.children.length === 1
          const style = needsInfo ? { marginLeft: 30 } : undefined;

          return (
            <>
            <div className='formatterContainer'>
              {needsInfo && (
                <CellActionsFormatter actions={actions} />
              )}
            </div>
            <div style={style}>{row.SeriesName}</div>
            </>
          );
        },
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
