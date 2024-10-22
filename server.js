const app = require('./src/app.js');
const PORT = process.env.PORT || 3000;


const server = app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing server...');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0); // Explicitly exit the process
    });
});
