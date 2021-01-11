const colors = require('colors/safe');
const os = require('os');

module.exports = class BrickBuilder {


    /**
     * Constructor
     * @param firstLayer
     */
    constructor(firstLayer) {
        this.firstLayer = firstLayer;
        this.layerN = this.firstLayer.length;
        this.layerM = this.firstLayer[0].length;
        this.secondLayer = Array.from(
            Array(this.layerN), _ => Array(this.layerM).fill(0)
        );
    }

    /**
     * Validates user input and returns false if there is no solution
     * @returns {boolean}
     */
    validateInput() {

        let bricksUsed = {};

        for (let n = 0; n < this.layerN; n++) {
            for (let m = 0; m < this.layerM; m++) {
                let halfBrick = this.firstLayer[n][m];
                if(this._canSkipCell(bricksUsed, n, m)) {
                    continue;
                }

                //if brick with this number is already used the input is wrong and there is no solution
                if(bricksUsed.hasOwnProperty(halfBrick)) {
                    return false;

                }
                //compare left and bottom array element if no match found there is no solution
                if (halfBrick === this.firstLayer[n][m + 1]) {
                    bricksUsed[halfBrick] = {n: n, m: m + 1};
                } else if(halfBrick === this.firstLayer[n + 1][m]) {
                    bricksUsed[halfBrick] = {n: n + 1, m: m};
                } else {
                    return false;
                }
            }
        }
        if(Object.keys(bricksUsed).length !== (this.layerN*this.layerM)/2) {
            return  false;
        }
        return true;

    }

    /**
     * Generate second layer based on user input
     * 
     */
    generateLayer() {
        let brickHalf = 1;

        for (let n = 0; n < this.layerN; n++) {
            for (let m = 0; m < this.layerM - 1; m++) {
                if(this.secondLayer[n][m] !== 0) {
                    continue;
                }
                if (this.firstLayer[n][m] != this.firstLayer[n][m + 1]) {
                    this.secondLayer[n][m] = brickHalf;
                    this.secondLayer[n][m + 1] = brickHalf;
                } else {
                    this.secondLayer[n][m] = brickHalf;
                    this.secondLayer[n + 1][m] = brickHalf;
                }
                brickHalf++;
            }
            if (this.secondLayer[n][this.layerM - 1] === 0) {
                this.secondLayer[n][this.layerM - 1] = brickHalf;
                this.secondLayer[n + 1][this.layerM - 1] = brickHalf;
                brickHalf++;
            }
        }

    }

    /**
     *  Creates a string that dispay second layer
     */
    displayLayer() {
        let tableSeparator = "*".repeat(this.layerM * 2 + 1);
        let rows = '*';
        for (let n = 0; n < this.layerN; n++) {
            let rowDelimiter = "*";

            for (let m = 0; m < this.layerM; m++) {
                rows += this.secondLayer[n][m];
                rows += (this.secondLayer[n][m] !== this.secondLayer[n][m + 1]) ? "*" : " ";
                if (n + 1 < this.secondLayer.length) {
                    if (this.secondLayer[n][m] === this.secondLayer[n + 1][m]) {
                        rowDelimiter += " ".repeat(this.secondLayer[n][m].toString().length) + "*";
                    } else {
                        rowDelimiter += "*".repeat(this.secondLayer[n][m].toString().length)  + "*";
                    }
                }
            }
            if (n + 1 !== this.secondLayer.length) {
                rows += os.EOL + rowDelimiter + os.EOL + "*";
            }
        }
        return tableSeparator  + os.EOL + rows + os.EOL + tableSeparator;
    }

    /**
     * Check if  can skip cell in first layer validation
     * @param {object} bricksUsed
     * @param  {int} n
     * @param {int} m
     * @returns {boolean}
     * @private
     */
    _canSkipCell(bricksUsed, n,m) {
        for (const [key, value] of Object.entries(bricksUsed)) {
            if(value.n === n && value.m === m ) {
                return true;
            }
        }
        return false;
    }
}