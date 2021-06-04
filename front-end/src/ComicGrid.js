import React from "react";
import DataGrid from "react-data-grid";
import "./App.css";

const columns = [
    { key: 'Requested', name: 'Requested' },
    { key: 'title', name: 'Title' },
    { key: 'IssueNumber', name: 'Issue Number' },
    { key: 'ReleaseDate', name: 'Release Date' },
    ];

const rows = [{id: 0, title: 'row1', count: 20}, {id: 1, title: 'row1', count: 40}, {id: 2, title: 'row1', count: 60}];

class ComicGrid extends React.Component {


  state = { rows };
  render() {
    return (
        <DataGrid
        columns={columns}
        rows={rows}
         />
    );
  }
}

export default ComicGrid