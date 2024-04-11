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
          <button className="circle" onClick={() => onClick(index)}>{value}</button>
          <div className={sideClassName}></div>
        </div>
        <div className={belowClassName}></div>
      </div>
    );
  }

export default function Board() {
  const [cellArrows, setCellArrows] = useState([]);
  const [cells, setCells] = useState([]);
  
  useEffect(() => {
    const initialCellArrows = [[],[1],[0],[],[0],[0,-1]];
    setCellArrows(initialCellArrows);

    const populateCells = (n_rows=3) => {
      let length = (n_rows * (n_rows + 1))/2;
      let cell_index = length;
      let tempCells = Array(length).fill(null);
      for (let row_i = n_rows; row_i > 0; row_i--) {
        for (let col_i = row_i - 1; col_i >= 0; col_i--) {
          cell_index--;
          // tempCells[cell_index] = cell_index + 1;
          tempCells[cell_index] = 1;
        }
      }
      setCells(tempCells);
    };

    populateCells();
  }, []);

  function handleClick(i) {
    const tempCells = cells.slice();
    tempCells[i] += 1;
    setCells(tempCells);
  }

  const renderCells = (n_rows=3) => {
    let board = [];
    let length = (n_rows * (n_rows + 1))/2;
    let cell_index = length;
    for (let row_i = n_rows; row_i > 0; row_i--) {
      const rowCells = [];
      const leftPadding = Array(n_rows - row_i).fill(null);
      for (let col_i = row_i - 1; col_i >= 0; col_i--) {
        cell_index--;
        const handleCellClick = (index) => () => handleClick(index);
        rowCells.push(
          <Cell 
            key={`cell-${cell_index}`}
            value={cells[cell_index]}
            arrows={cellArrows[cell_index]}
            onClick={handleCellClick(cell_index)}
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

  let status = "You can do it!";
  if (checkSuccess(cells, 3)) {
    status = "Congrats! You got it!";
  }

  return (
    <>
      <div className="centered-row">{status}</div>
      {renderCells()}
    </>
  );
}

function checkSuccess(cells, n_rows) {
  console.log("entered checkSuccess");
  let diff_i = 0;
  let subt_i = 1;
  for (let row_i=1; row_i<=n_rows-1; row_i++) {
    for (let col_i=row_i; col_i>0; col_i--) {
      console.log(`${diff_i}, ${subt_i}, ${subt_i+1}`);
      if (Math.abs(cells[subt_i + 1] - cells[subt_i]) != cells[diff_i]) {
        return false;
      }
      diff_i++;
      subt_i++;
    }
    subt_i++;
  }
  return true;
}