import React, { useState } from 'react';
import Cell from './Cell';

function Board({ numRows, cells, clueCells, cellArrows, selectedNumber, scratchArrays, scratch, onPlay }) {

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
        <div className="game-board">
            <div className="board-container">
                {renderCells()}
            </div>
        </div>
    );
};
export default Board;