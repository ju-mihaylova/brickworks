#!/usr/bin/env node
'use strict'

const prompt = require('prompt');
const colors = require('colors/safe');
const BrickBuilder = require('../lib/BrickBuilder');

function main() {

    const properties = [
        {
            name: 'nAndM',
            message: colors.green('Please enter N (length) and M (width) separated with a space.'),
            required: true,
            warning: colors.red('M and N should be even numbers. M are N numbers up to 100.'),
            conform: (value) => {
                const nAndM = value.split(' ');
                if (nAndM.length !== 2) {
                    return false;
                }
                let n = parseInt(nAndM[0]);
                let m = parseInt(nAndM[1]);
                if((m < 2 || m > 100 || m % 2 !== 0) || (n < 2 || n > 100 || n % 2 !== 0)) {
                    return false;
                }

                return true
            }
        },
    ];

    prompt.message = colors.magenta("Brickworks");
    prompt.start();

    prompt.get(properties, (err, result) => {
        if (err) {
            return onErr(err);
        }
        let nAndM = result.nAndM.trim().split(' ');
        let n = parseInt(nAndM[0]);
        let m = parseInt(nAndM[1]);
        let brickProps = [];
        //n is brick length
        for(let i = 0; i < n; i += 1) {
            brickProps.push({
                name: 'brickProp' + i,
                message: colors.green(`Please enter a row of half of bricks n #${i + 1}.`),
                required: true,
                warning: colors.red(`Half of bricks should be ${m} in a row. Please enter valid input.`),
                conform: (value) => {
                    const brickProp = value.trim().split(' ');
                    //m is brick width
                    if (brickProp.length !== m) {
                        return false;
                    }

                    if (Math.max(...brickProp) > (m * n) / 2) {
                        return false;
                    }

                    return true;
                }
            })
        }

        prompt.get(brickProps, (err, result) => {
            let firstLayer = [];
            for (const prop in result) {
                let firstLayerRow = Object.values(result[prop].split(' '));
                firstLayerRow = firstLayerRow.map(x => parseInt(x));
                firstLayer.push(firstLayerRow);
            }
            const brickBuilder = new BrickBuilder(firstLayer);
            if(!brickBuilder.validateInput()) {
                console.log(colors.red('-1. No solution'));
                return -1;
            }
            brickBuilder.generateLayer();
            console.log(brickBuilder.displayLayer());
        })

    });
    function onErr(err) {
        console.log(err);
        return 1;
    }
}

main();
