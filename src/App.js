import { useState, useEffect } from 'react';
import Keypad from './components/Keypad';
import Board from './components/Board';
import Info from './components/Info';

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
  for (let row_i = 1; row_i <= n_rows - 1; row_i++) {
    for (let col_i = row_i; col_i > 0; col_i--) {
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
};


export default function Game() {
  const [numRows, setNumRows] = useState(2);
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
    let length = (numRows * (numRows + 1)) / 2;
    // cells, cellArrow could come from a db but there's just not very many possible
    if (numRows == 2) {
      const map = new Map([
        [1, 1],
        [2, 0]
      ])
      setCellArrows(map);
    }
    if (numRows == 3) {
      const map = new Map([
        [1, 1],
        [3, 1],
        [5, -1],
      ]);
      setCellArrows(map);
    }
    else if (numRows == 4) {
      const map = new Map([
        [1, 1],
        [5, -1],
        [6, 1],
        [8, -1],
      ]);
      setCellArrows(map);
    }
    else if (numRows == 5) {
      const map = new Map([
        [13, 0],
        [9, -1],
        [7, 1],
        [2, -1],
      ])
      setCellArrows(map);
    }
    // setCellArrows(initialCellArrows);

    const initializeCells = () => {
      let tempCells = Array(length).fill(null);
      if (numRows == 2) {
        tempCells[0] = 1;
      }
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

  function handlePlay(nextCells, nextSelectedNumber, nextScratchArrays) {
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
      <div className="center-wrapper">
        <div className="game-container">
          <Info />
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
          <Keypad
            status={checkSuccess(cells, numRows)}
            numbers={numbers}
            scratch={scratch}
            onNumPress={handleNumPress}
            onScratchPress={handleScratchPress}
          />
        </div>
      </div>
      <div className="centered-row">{hasWon ? "🎉 Congrats! The largest exact difference triangle has 5 rows, and you solved it!" : checkSuccess(cells, numRows)}</div>
    </>
  );
};

