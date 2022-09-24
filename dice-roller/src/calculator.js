function getRawDieResult(size){
    // Produce values between 1 and size
    return Math.floor(Math.random() * size) + 1;
}

function getRawRollResult(numDice, numFaces){
    var sizedArray = [...Array(numDice).keys()];
    return sizedArray.map((val, index, array) => getRawDieResult(numFaces));
}

function addInExplosions(rawResults, numExplosions, numFaces){
    do{
        var subResults = getRawRollResult(numExplosions, numFaces);
        // circle back and do this a fancier way to preserve sorted order?
        rawResults = rawResults.concat(subResults)
        numExplosions = subResults.reduce((count, curEntry) => {
            if(curEntry === numFaces){
                return ++count;
            }
            return count;
        }, 0);
    } while(numExplosions > 0);
    return rawResults;
}

function addInExplosionsOrBotches(rawResults, numFaces){
    // positive is explosions, negative is net botches
    let numExplosions = rawResults.reduce((count, curEntry) => {
        switch(curEntry){
            case numFaces:
                return ++count;
            case 1:
                return --count;
            default:
                return count;
        }
    }, 0);
    if(numExplosions > 0){
        return addInExplosions(rawResults, numExplosions, numFaces);
    }
    else if(numExplosions < 0){
        return rawResults.concat(Array(Math.abs(numExplosions)).fill(-numFaces));
    }
    return rawResults;
}

function handleBumps(rawResults, numFaces, bumps, numOnesCanBump){
    // sort descending
    bumps = bumps || 0;
    numOnesCanBump = numOnesCanBump || 0;

    rawResults.sort((left, right) => right - left);
    while(bumps > 0){
        var indexOfFirstNonMaxResult = rawResults.findIndex(d => d < numFaces);
        if( indexOfFirstNonMaxResult === undefined){
            // return 'extra' bumps to be just raw bonus
            return [rawResults, bumps];
        }
        if( rawResults[indexOfFirstNonMaxResult] === 1){
            if(numOnesCanBump <= 0){
                return [rawResults, bumps];
            }
            bumps--;
            numOnesCanBump--;
            rawResults[indexOfFirstNonMaxResult] = 2;
        }

        var amountToBump = Math.min(bumps, numFaces - rawResults[indexOfFirstNonMaxResult]);
        rawResults[indexOfFirstNonMaxResult] = rawResults[indexOfFirstNonMaxResult] + amountToBump;
        bumps -= amountToBump;
    }
    return [rawResults, 0];
}
function calculateResult(numDice, numFaces, bumps, numOnesCanBump){
    var rawResults = getRawRollResult(numDice, numFaces);
    var [bumpedResults, bonus] = handleBumps(rawResults, numFaces, bumps, numOnesCanBump);
    var finalResults = addInExplosionsOrBotches(bumpedResults, numFaces);
    var total = finalResults.reduce((runningTotal, curEntry)=>runningTotal + curEntry) + bonus;
    var diceRolled = finalResults.filter(result => result > 0);
    var numExplosions = diceRolled.length - rawResults.length;
    return [diceRolled, total, numExplosions];
}

class Result{
    constructor(rolls,total,numExplosions){
        this.rolls = rolls;
        this.total = total;
        this.numExplosions = numExplosions;
    }
}

//console.log(`Total: ${calculateResult(10,6,2)}`);
export default calculateResult;