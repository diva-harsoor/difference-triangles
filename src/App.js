import { useState } from 'react';

function Square() {
    return <button className="square">0</button>;
  }

export default function Board({ n_rows }) {
  let length = 0;
  for (let i = 0; i < n_rows; i++) {
    length += i;
  }

  const renderSquare = (index) => (
    <Square key={index} />
  );

  const renderCells = () => {
    let cells = Array(length).fill(null);
    let counter = 0;
    for (let row_i = n_rows; row_i > 0; row_i--) {
      const rowSquares = Array(row_i).fill(null);
      const leftPadding = Array(n_rows - row_i).fill(<div className="empty-square" />);
      for (let col_i = row_i - 1; col_i >= 0; col_i--) {
        cellsCopy.push(renderSquare(counter++));
      }
      const row = (
        <div key={row_i} className="board-row centered-row" >
          {leftPadding}
          {rowSquares}
        </div>
      );
      cells.push(row);
    }
    return cells;
  }

  return <>{renderCells()}</>;
}