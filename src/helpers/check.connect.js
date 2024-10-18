'use strict'
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000;
const _MAX_CONECTIONS_1_CPU = 5;
// count connections
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    //console.log(`Total connections: ${numConnection}`);
    return numConnection;
}

// check overload connections
const checkOverload = () => {
    const numConnection = countConnect();
    const numCpu = os.cpus().length;
    const memoryUsage = process.memoryUsage();
    console.log('Active connections: ' + numConnection);
    console.log(`Memory usage: ${memoryUsage.rss/1024/1024} MB`);
    if (numConnection > numCpu * _MAX_CONECTIONS_1_CPU) {
        console.log(`Overload connections: ${numConnection}`);
    }
}


module.exports = { countConnect, checkOverload };