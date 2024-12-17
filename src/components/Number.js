import React, {useState} from 'react';

function Number({ index, value, onClick }) {
    return(
      <button key={index} className="keypad-button" onClick={() => onClick(index)}>{value}</button>
    );
  }
  
  export default Number;