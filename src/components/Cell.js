import React, { useState } from 'react';

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
  };

  export default Cell;
  