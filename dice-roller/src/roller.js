import React from 'react';
import calculateResult from './calculator';

function Roller() {
    const [state, setState] = React.useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            numExplosions: 0,
            diceRolled: [],
            total: 0,
            numDice: 0,
            numFaces: 0,
            numBumps: 0,
            numBumpsOne: 0
        }
    );

    function onClick() {
        let [_diceRolled, _total, _numExplosions] = calculateResult(state.numDice,state.numFaces,state.numBumps,state.numBumpsOne);
        setState({
            diceRolled: _diceRolled,
            total: _total,
            numExplosions: _numExplosions
        });
    }

    function onChangeHandler(event){
        const {name, value} = event.target;
        setState({[name]: Number(value)});
    }

    return (
    <div className="entry-box">
        <p>What are we rolling? 
            <span>
                <input name="numDice" className='num-dice' type="text" value={state.numDice} onChange={onChangeHandler}/>d
                <input name="numFaces" className='num-faces' type="text" value={state.numFaces} onChange={onChangeHandler}/>+
                <input name="numBumps" className='num-bumps' type="text" value={state.numBumps} onChange={onChangeHandler}/>
            </span>
        </p>
        <p>
            How many 1-bumps?<input name="numBumpOne" className='one-bumps' type='text' value={state.numBumpsOne} onChange={onChangeHandler}/>
        </p>
        <button onClick={onClick}>
            Calculate
        </button>
        <div id="outcomes" style={{display: state.diceRolled.length > 0 ? 'block' : 'none'}}>
            <p id="num-explosions">You got {state.numExplosions} explosions!</p>
            <p id="roll-results">These were your rolls: {state.diceRolled} (# rolled: {state.diceRolled.length})</p>
            <p id="total">Total: {state.total}</p>
        </div>
    </div>
    );
  }

  export default Roller;