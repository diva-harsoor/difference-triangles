import { useState, useEffect } from 'react';

// Circle with arrows
// Arrows are right-to-left, top-to-bottom
function Cell({ index, value, arrow, rowEnd, onClick, style }) {
  // arrows that go between two cells in the same row
  const sideClassName = `rhombus center ${(arrow == 0) ? 'purple' : ''}`;

  // arrows that go from a cell in one row to a cell in a different row
  const belowClassName = `rhombus ${
    (arrow == 1) ? 'tilt-left purple' : ''
  } ${(arrow == -1) ? 'tilt-right purple' : ''}`;

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

  const circleSize = `${250 / numRows}px`;
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
    for (const [key, value] of cellArrows) {
      console.log(`Key:`, key, `Type of key:`, typeof key, `Value:`, value);
    }
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
            arrow={cellArrows.has(cell_index) ? cellArrows.get(cell_index) : 2}
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
  if (n_rows === 5) {
    return "Congrats! You won the game!";
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
  const [cellArrows, setCellArrows] = useState(new Map());
  // const [cellArrows, setCellArrows] = useState([]);
  const [clueCells, setClueCells] = useState([]);
  const [cells, setCells] = useState([]);
  const [scratchArrays, setScratchArrays] = useState([]);
  const [scratch, setScratch] = useState(false); // move
  const [numbers, setNumbers] = useState([]); // move
  const [selectedNumber, setSelectedNumber] = useState(-1); // move?
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    let length = (numRows * (numRows + 1))/2;
    // cells, cellArrow could come from a db but there's just not very many possible
    if (numRows == 3) {
      const map = new Map([
        [1, 1],
        [3, 1],
        [5, -1],
      ]);
      setCellArrows(map)
    }
    else if (numRows == 4) {
      const map = new Map([
        [1,1],
        [5,-1],
        [6,1],
        [8,-1],
      ]);
      setCellArrows(map)
    }
    else if (numRows == 5) {
      const map = new Map([
        [13,0],
        [9,-1],
        [7, 1],
        [2,-1],
      ])
      setCellArrows(map);
    }
    // setCellArrows(initialCellArrows);

    const initializeCells = () => {
      let tempCells = Array(length).fill(null);
      if (numRows == 3) {
        tempCells[0] = 2;
      }
      if (numRows == 4) {
        tempCells[0] = 3;
        tempCells[2] = 5;
      }
      if (numRows == 5) {
        tempCells[0] = 5;
        tempCells[4] = 11;
        tempCells[13] = 14;
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

  if (checkSuccess(cells, numRows) == "Congrats! You got it!" && numRows < 5) {
    setNumRows(numRows + 1);
  }

  if (checkSuccess(cells, numRows) === "Congrats! You won the game!" && !hasWon) {
    setHasWon(true);
  }

  return (
    <>
    <div className="centered-row"><h1>Difference Triangle Game</h1></div>
    <div className="centered-row">{hasWon ? "🎉 Congrats! You solved the difference triangle!" : checkSuccess(cells, numRows)}</div>
    <div className="center-wrapper">
      <div className="game-container">
        <div className="info">
            <h2>Instructions</h2>
            Complete the difference triangle such that:
            <ul>
              <li>Each cell is the difference of the two above it.</li>
              <li>A diamond between two cells denotes a difference of 1.</li>
              <li>Each number is used exactly once.</li>
            </ul>
            To play: 
            <ul>
              <li>Click on a number and then click on the circle you want to place it in</li>
              <li>Click on a circle to clear it</li>
              <li>Click "Enable scratch" to add multiple numbers you are considering to a circle</li>
            </ul>
          </div>
        <div className="game-board">
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
        <div className="keypad-box">
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
      </div>
    </div>
    </>
  );
}