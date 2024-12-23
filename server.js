const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);

    console.log(`Request received for: ${parsedUrl.pathname}`);

    const logEntry = `URL: ${parsedUrl.pathname}\nTimestamp: ${new Date().toISOString()}\n\n`;
    fs.appendFile('log.txt', logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    if (parsedUrl.pathname === '/documentation') {  
        fs.readFile('./documentation.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading documentation.html:', err);
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('Error: Unable to load documentation.');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    } else if (parsedUrl.pathname === '/favicon.ico') {
        response.writeHead(204); 
        response.end();
    } else if (parsedUrl.pathname === '/') {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('Welcome to API server!');
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Page not found.');
    }
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
