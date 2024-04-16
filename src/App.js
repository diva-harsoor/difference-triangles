import { useState, useEffect } from 'react';

// Circle with arrows
// Arrows are right-to-left, top-to-bottom
function Cell({ index, value, arrows, rowEnd, onClick }) {
  const sideClassName = `rhombus center ${arrows && arrows.includes(0) ? 'purple' : ''}`;

  const belowClassName = `rhombus ${
    arrows && arrows.includes(1) ? 'tilt-left purple' : ''
  } ${arrows && arrows.includes(-1) ? 'tilt-right purple' : ''}`;

  return (
    <div key={index} className="cell-container">
      <div className="cell-row">
        <button className="circle" onClick={() => onClick(index)}>{value}</button>
        {!rowEnd && <div className={sideClassName}></div>}
      </div>
      <div className={belowClassName}></div>
    </div>
  );
}

function Number({ index, value, onClick }) {
  return(
    <button key={index} className="number-button" onClick={() => onClick(index)}>{value}</button>
  );
}

export default function Board() {
  const [numRows, setNumRows] = useState(3);
  const [cellArrows, setCellArrows] = useState([]);
  const [clueCells, setClueCells] = useState([]);
  const [cells, setCells] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(-1);
  
  useEffect(() => {
    let length = (numRows * (numRows + 1))/2;
    // cells, cellArrow will eventually come from question set (db)
    const initialCellArrows = [[],[1],[],[1],[],[-1]];
    setCellArrows(initialCellArrows);

    const populateCells = () => {
      let tempCells = Array(length).fill(null);
      tempCells[0] = 2;
      /*
      let tempCells = [];
      let length = (n_rows * (n_rows + 1))/2;
      for (let i = 0; i < length; i++) {
        tempCells.push(i);
      }
      */
      setCells(tempCells);
      setClueCells(tempCells);
    };

    const populateNumbers = () => {
      let tempNumbers = [];
      for (let i = 1; i <= length; i++) {
        tempNumbers.push(i);
      }
      setNumbers(tempNumbers);
    };

    populateCells();
    populateNumbers();
  }, []);

  function handleCellClick(i) {
    if (!clueCells[i]) {
      if (selectedNumber != -1) {
        const tempCells = cells.slice();
        tempCells[i] = selectedNumber;
        setCells(tempCells);
        setSelectedNumber(-1);
      }

      else if (cells[i]) {
        const tempCells = cells.slice();
        tempCells[i] = null;
        setCells(tempCells);
      }
    }
  }

  function handleNumClick(i) {
    setSelectedNumber(i+1);
  }

  const renderCells = () => {
    let board = [];
    let cell_index = cells.length;
    for (let row_i = numRows; row_i > 0; row_i--) {
      const rowCells = [];
      const leftPadding = Array(numRows - row_i).fill(null);
      for (let col_i = row_i - 1; col_i >= 0; col_i--) {
        cell_index--;
        const handleEachCellClick = (index) => () => handleCellClick(index);
        rowCells.push(
          <Cell 
            key={`cell-${cell_index}`}
            value={cells[cell_index]}
            arrows={cellArrows[cell_index]}
            rowEnd={col_i == 0}
            onClick={handleEachCellClick(cell_index)}
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

  const renderNumberBank = () => {
    if (numbers.length == 0) {
      return [];
    }
    else {
    }
    let halflength = Math.floor(numbers.length/2);
    let factor_short = halflength;
    let min_diff = numbers.length;
    for (let i = 2; i < halflength; i++) {
      let factor = numbers.length/i;
      if ((factor % 1) == 0) {
        let complement = numbers.length/factor;
        if (Math.abs(complement - factor) < min_diff) {
          min_diff = Math.abs(complement - factor);
          factor_short = factor < complement ? factor : complement;
        }
      }
    }

    let bank = [];
    let factor_long = numbers.length/factor_short;
    let counter = 0;
    for (let row_i=0; row_i<factor_short; row_i++) {
      const rowNums = [];
      for (let col_i=0; col_i<factor_long; col_i++) {
        const handleEachNumClick = (index) => () => handleNumClick(index);
        rowNums.push(
          <Number
            key={`number-${counter+1}`}
            index={counter}
            value={numbers[counter]}
            onClick={handleEachNumClick(counter)}
          />
        );
        counter++;
      }
      const numberRows = (
        <div key={`numrow-${row_i}`} className="centered-row">
          {rowNums}
        </div>
      );
      bank.push(numberRows);
    }
    return bank;
  }

  /*
  let status = "You can do it!";
  if (checkSuccess(cells, 3)) {
    status = "Congrats! You got it!";
  }
  */

  return (
    <>
      <div className="centered-row">{checkSuccess(cells,3)}</div>
      {renderCells()}
      {renderNumberBank()}
    </>
  );
}

function checkSuccess(cells, n_rows) {
  let cells_freq = Array(cells.length).fill(0);
  for (let i = 0; i < cells.length; i++) {
    if (cells[i]) {
      cells_freq[cells[i]]++;
      if (cells_freq[cells[i]] > 1) {
        return "Uh-oh, you have a duplicate.";
      } 
    }
  }
  let diff_i = 0; // index of difference
  let subt_i = 1; // index of subtrahend
  for (let row_i=1; row_i<=n_rows-1; row_i++) {
    for (let col_i=row_i; col_i>0; col_i--) {
      // check difference in each sub-triangle
      if (Math.abs(cells[subt_i + 1] - cells[subt_i]) != cells[diff_i]) {
        return "You can do it!";
      }
      diff_i++;
      subt_i++;
    }
    subt_i++;
  }
  return "Congrats! You got it!";
}