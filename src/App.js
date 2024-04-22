import { useState, useEffect } from 'react';

// Circle with arrows
// Arrows are right-to-left, top-to-bottom
function Cell({ index, value, arrows, rowEnd, onClick, style }) {
  const sideClassName = `rhombus center ${arrows && arrows.includes(0) ? 'purple' : ''}`;

  const belowClassName = `rhombus ${
    arrows && arrows.includes(1) ? 'tilt-left purple' : ''
  } ${arrows && arrows.includes(-1) ? 'tilt-right purple' : ''}`;

  let buttonClassName = `circle ${typeof value == "object" ? "scratch" : ""}`;

  return (
    <div key={index} className="cell-container">
      <div className="cell-row">
        <button className={buttonClassName} onClick={() => onClick(index)} style={style}>
          {value}
        </button>
        {!rowEnd && <div className={sideClassName}></div>}
      </div>
      <div className={belowClassName}></div>
    </div>
  );
}

function Number({ index, value, onClick }) {
  return(
    <button key={index} className="keypad-button" onClick={() => onClick(index)}>{value}</button>
  );
}

function Board({numRows, cells, clueCells, cellArrows, selectedNumber, scratchArrays, scratch, onPlay}) {

  const circleSize = `${400 / numRows}px`;
  const fontSize = `${24 * (3 / numRows)}px`; // Adjust the multiplier as needed
  const circleStyle = {
    width: circleSize,
    height: circleSize,
    fontSize: fontSize,
  };
    
  function handleCellClick(i) {
    let tempCells = cells.slice();
    let tempSelectedNumber = selectedNumber;
    let tempScratchArrays = scratchArrays.map(innerArr => [...innerArr]);
    if (!clueCells[i]) {
      if (scratch && (selectedNumber != -1)) {
        if (scratchArrays[i].includes(`${selectedNumber},`)) {
          tempScratchArrays[i] = tempScratchArrays[i].filter(num => num !== `${selectedNumber},`);
        }
        else {
          tempScratchArrays[i].push(`${selectedNumber},`);
        }
        tempSelectedNumber = -1;
      }
      else {
        if (selectedNumber != -1) {
          tempCells[i] = selectedNumber;
          tempSelectedNumber = -1;
        }

        else if (cells[i]) {
          tempCells[i] = null;
        }
      }
    }
    onPlay(tempCells, tempSelectedNumber, tempScratchArrays)
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
        let value = cells[cell_index] ? cells[cell_index] : scratchArrays[cell_index];
        rowCells.push(
          <Cell 
            key={`cell-${cell_index}`}
            value={value}
            arrows={cellArrows[cell_index]}
            rowEnd={col_i == 0}
            scratch={scratch}
            onClick={handleEachCellClick(cell_index)}
            style={circleStyle}
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


  return (
    <div className="board-container">
      {renderCells()}
    </div>
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
        return "";
      }
      diff_i++;
      subt_i++;
    }
    subt_i++;
  }
  return "Congrats! You got it!";
}

function Keypad({ status, numbers, scratch, onNumPress, onScratchPress }) {
  function handleNumClick(i) {
    onNumPress(i+1);
  }

  function handleScratchClick() {
    onScratchPress(!scratch);
  }

  const renderNumberBank = () => {
    if (numbers.length == 0) {
      console.log("hit numbers.length == 0");
      return [];
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
    if (status) {
      bank.push(
        <button key={`status`} className="keypad-button">{status}</button>
      );
    }
    let factor_long = numbers.length/factor_short;
    let counter = 0;
    for (let row_i=0; row_i<factor_long; row_i++) {
      const rowNums = [];
      for (let col_i=0; col_i<factor_short; col_i++) {
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
    bank.push(
      <button key={`scratch`} className="keypad-button scratch" onClick={handleScratchClick}>
        {scratch ? "Disable scratch" : "Enable scratch"}
      </button>
    );
    return bank;
  }
  return (
    <>
      {renderNumberBank()}
    </>
  );
}

export default function Game() {
  const [numRows, setNumRows] = useState(3);
  const [cellArrows, setCellArrows] = useState([]);
  const [clueCells, setClueCells] = useState([]);
  const [cells, setCells] = useState([]);
  const [scratchArrays, setScratchArrays] = useState([]);
  const [scratch, setScratch] = useState(false); // move
  const [numbers, setNumbers] = useState([]); // move
  const [selectedNumber, setSelectedNumber] = useState(-1); // move?

  useEffect(() => {
    let length = (numRows * (numRows + 1))/2;
    // cells, cellArrow will eventually come from question set (db)
    let initialCellArrows = [];
    if (numRows == 3) {
      initialCellArrows = [[],[1],[],[1],[],[-1]];
    }
    else if (numRows == 4) {
      initialCellArrows = [[],[1],[],[],[],[-1],[1],[],[-1],[]];
    }
    setCellArrows(initialCellArrows);

    const initializeCells = () => {
      let tempCells = Array(length).fill(null);
      if (numRows == 3) {
        tempCells[0] = 2;
      }
      else if (numRows == 4) {
        tempCells[0] = 3;
        tempCells[2] = 5;
      }
      setCells(tempCells);
      setClueCells(tempCells);
    };

    const initializeScratchArrays = () => {
      let tempScratchArrays = Array(length).fill(null).map(() => Array(length).fill(null));
      setScratchArrays(tempScratchArrays);
    }

    const populateNumbers = () => {
      let tempNumbers = [];
      for (let i = 1; i <= length; i++) {
        tempNumbers.push(i);
      }
      setNumbers(tempNumbers);
    };

    initializeCells();
    initializeScratchArrays();
    populateNumbers();
    setScratch(false);
  }, [numRows]);

  function handlePlay(nextCells, nextSelectedNumber, nextScratchArrays)  {
    setCells(nextCells);
    setSelectedNumber(nextSelectedNumber);
    setScratchArrays(nextScratchArrays);
  }

  function handleNumPress(nextSelectedNumber) {
    setSelectedNumber(nextSelectedNumber);
  }

  function handleScratchPress(nextScratch) {
    setScratch(nextScratch);
  }

  if (checkSuccess(cells, numRows) == "Congrats! You got it!") {
    setNumRows(numRows + 1);
  }

  return (
    <>
    <h1 className="centered-row">Can you solve the difference triangle?</h1>
    <div className="game-container">
      <div className="instructions">
        Complete the difference triangle such that:
        <ul>
          <li>Each cell is the difference of the two above it.</li>
          <li>A diamond between two cells denotes a difference of 1.</li>
          <li>Each number is used exactly once.</li>
        </ul>
      </div>
      <div className="game-board">
        <div className="centered-row">{checkSuccess(cells, numRows)}</div>
        <Board
          numRows={numRows}
          cells={cells}
          clueCells={clueCells}
          cellArrows={cellArrows}
          selectedNumber={selectedNumber}
          scratchArrays={scratchArrays}
          scratch={scratch}
          onPlay={handlePlay}
        />
      </div>
      <div className="keypad">
        <Keypad
          status={checkSuccess(cells, numRows)}
          numbers={numbers}
          scratch={scratch}
          onNumPress={handleNumPress}
          onScratchPress={handleScratchPress}
        />
      </div>
    </div>
    </>
  );
}