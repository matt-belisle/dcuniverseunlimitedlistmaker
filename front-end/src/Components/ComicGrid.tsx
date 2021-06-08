import { useMemo, useReducer, useState } from "react";
import DataGrid from "react-data-grid";
import { ComicRow, createTestRows, baseComicRow, Comic } from "./Comic";
import { CellExpanderFormatter } from "./Formatters/CellExpanderFormatter";
import { CellActionsFormatter } from "./Formatters/CellActionsFormatter";
import type { Column } from "react-data-grid";
//necessary to make things pure for the reducer, was running into issues without this
import { cloneDeep } from "lodash";
import Popup from "./Popup";
import ComicInformation from "./ComicInformation";
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

const findUUID = (rows: ComicRow[], UUID: string) =>  rows.reduce((acc: number[], el: ComicRow, i: number) => (el.UUID === UUID ? [...acc, i] : acc), []); 

function selectSubRow(rows: ComicRow[], UUID: string): ComicRow[] {
  const rowsIndex = findUUID(rows, UUID);
  //doing it like this allows the parent to contain a uuid, this will get the last element in the grid with the UUID
  //which is the selected subrow
  const rowIndex = rowsIndex[rowsIndex.length - 1];
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
          ...row.children[0],
        };
      }
      //if one of the children is selected we should display that on the parent row
      let selected = row.children.find((x) => x.isSelected === true);
      if (selected !== undefined) {
        return {
          requested: row.requested,
          children: row.children,
          ...selected,
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
      throw new Error(`You screwed up: ${type} is not an action in the reducer`)
      return rows;
  }
}

const defaultRows = createTestRows();

export default function ComicGrid() {
  const mappedRows = remapParents(defaultRows);

  const [rows, dispatch] = useReducer(reducer, mappedRows);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [infoComic, setInfoComic] = useState<ComicRow>(baseComicRow("", false, false, []))

  const comicInformation = <ComicInformation comic={infoComic} />

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
                if(row.children !== undefined){

                }
                setInfoComic(row);
                setIsOpen(true);
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
        key: "IssueNumber",
        name: "Issue Number",
      },
      {
        key: "ReleaseDate",
        name: "Release Date",
      },
    ];
  }, []);

  return (
    <div>
      <DataGrid columns={columns} rows={rows} />
      {isOpen && <Popup content={comicInformation} handleClose={() => setIsOpen(false)} />}

    </div>
  );
}
