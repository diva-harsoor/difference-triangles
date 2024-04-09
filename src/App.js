import { useState, useEffect } from 'react';

function Square({ value }) {
    return <button className="square">{value}</button>;
  }

export default function Board() {
  const renderSquare = (value) => (
    <Square key={value} value={value} />
  );

  // Combine, refactor
  const renderColDot = () => (
    <div className="coldot"></div>
  )

  const renderRowDot = () => (
    <div className="rowdot"></div>
  )

  const renderCells = (n_rows=3) => {
    let board = [];
    let length = (n_rows * (n_rows + 1))/2;
    let cell_index = length;
    for (let row_i = n_rows; row_i > 0; row_i--) {
      const rowSquares = Array(row_i).fill(null);
      const rowDots = Array(row_i).fill(null);
      const leftPadding = Array(n_rows - row_i).fill(<div className="empty-square" />);
      for (let col_i = row_i - 1; col_i >= 0; col_i--) {
        cell_index--;
        rowSquares.push(renderSquare(cell_index + 1));
        rowSquares.push(renderColDot(cell_index + 1));
        rowDots.push(renderRowDot(cell_index + 1))
      }
      const squareRow = (
        <div key={row_i} className="board-row centered-row" >
          {leftPadding}
          {rowSquares}
        </div>
      );
      const dotRow = (
        <div key={row_i} className="board-row centered-row" >
        {leftPadding}
        {rowDots}
      </div>
      );
      board.push(squareRow);
      board.push(dotRow);
    }
    return board;
  };

  return <>{renderCells()}</>;
}