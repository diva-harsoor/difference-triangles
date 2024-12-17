import React, { useState } from 'react';
import Number from './Number';


function Keypad({ status, numbers, scratch, onNumPress, onScratchPress }) {
    function handleNumClick(i) {
        onNumPress(i + 1);
    }

    function handleScratchClick() {
        onScratchPress(!scratch);
    }

    const renderNumberBank = () => {
        if (numbers.length == 0) {
            return [];
        }
        let halflength = Math.floor(numbers.length / 2);
        let factor_short = halflength;
        let min_diff = numbers.length;
        for (let i = 2; i < halflength; i++) {
            let factor = numbers.length / i;
            if ((factor % 1) == 0) {
                let complement = numbers.length / factor;
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
        let factor_long = numbers.length / factor_short;
        let counter = 0;
        for (let row_i = 0; row_i < factor_long; row_i++) {
            const rowNums = [];
            for (let col_i = 0; col_i < factor_short; col_i++) {
                const handleEachNumClick = (index) => () => handleNumClick(index);
                rowNums.push(
                    <Number
                        key={`number-${counter + 1}`}
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
};

export default Keypad;