const app = require('./src/app.js');
const PORT = 3000;


const server = app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log(`Process terminated`);
    });
});