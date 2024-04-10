import { useState, useEffect } from 'react';

// Circle with arrows
function Cell({ index, value, arrows, onClick }) {
  const sideClassName = `rhombus center ${arrows && arrows.includes(0) ? 'purple' : ''}`;

  const belowClassName = `rhombus ${
    arrows && arrows.includes(1) ? 'tilt-left purple' : ''
  } ${arrows && arrows.includes(-1) ? 'tilt-right purple' : ''}`;

  return (
      <div key={index} className="cell-container">
        <div className="cell-row">
          <button className="circle" onClick={onClick}>{value}</button>
          <div className={sideClassName}></div>
        </div>
        <div className={belowClassName}></div>
      </div>
    );
  }

export default function Board() {
  const [cellArrows, setCellArrows] = useState([]);
  
  useEffect(() => {
    const initialCellArrows = [
      [],
      [1],
      [0],
      [],
      [0],
      [0,-1],
    ];
    setCellArrows(initialCellArrows);
  }, []);

  const renderCells = (n_rows=3) => {
    let board = [];
    let length = (n_rows * (n_rows + 1))/2;
    let cell_index = length;
    for (let row_i = n_rows; row_i > 0; row_i--) {
      const rowCells = [];
      const leftPadding = Array(n_rows - row_i)
        .fill(<div className="empty-square" />)
        .map((_, index) => <div key={`padding-${row_i}-${index}`}> </div>);
      for (let col_i = row_i - 1; col_i >= 0; col_i--) {
        cell_index--;
        rowCells.push(
          <Cell 
            key={`cell-${cell_index}`}
            value={cell_index + 1}
            arrows={cellArrows[cell_index]}
          />
        );
      }
      const cellRows = (
        <div key={`row-${row_i}`} className="board-row centered-row" >
          {leftPadding}
          {rowCells}
        </div>
      );
      board.push(cellRows);
    }
    return board;
  };

  return <>{renderCells()}</>;
}