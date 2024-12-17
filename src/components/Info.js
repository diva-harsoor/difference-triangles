import React from 'react';

function Info() {
    return (
        <div className="info">
            <h2>Instructions</h2>
            Complete the difference triangle such that:
            <ul>
                <li>Each cell is the difference of the two above it.</li>
                <li>A ±1 symbol between two cells denotes a difference of 1.</li>
                <li>Each number is used exactly once.</li>
            </ul>
            To play:
            <ul>
                <li>Click on a number and then click on the circle you want to place it in</li>
                <li>Click on a circle to clear it</li>
                <li>Click "Enable scratch" to add multiple numbers you are considering to a circle</li>
            </ul>
        </div>
    )
};

export default Info;