import React, { useState } from 'react';

// Circle with arrows
// Arrows are right-to-left, top-to-bottom
function Cell({ index, value, arrow, rowEnd, onClick, style }) {
  
    const sideClassName = (arrow === 0) ? 'active-hint' : 'inactive-hint';
    const belowClassName = ((arrow === 1) || (arrow === -1)) ? 'active-hint' : 'inactive-hint';

    let buttonClassName = `circle ${typeof value == "object" ? "scratch" : ""}`;
  
    return (
      <div key={index} className="cell-container">
        <div className="cell-row">
          <button className={buttonClassName} onClick={() => onClick(index)} style={style}>
            {value}
          </button>
          {!rowEnd && <div className={sideClassName}>±1</div>}
        </div>
        <div className={belowClassName}>±1</div>
      </div>
    );
  };

  export default Cell;
  