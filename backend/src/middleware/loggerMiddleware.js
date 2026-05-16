const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  // Listen for the response to finish to get the final status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    const time = new Date().toLocaleString(); // Easy to read time
    
    // Determine color based on status code for better terminal readability
    const status = res.statusCode;
    let statusColor = '\x1b[32m'; // Green for 200s
    if (status >= 300) statusColor = '\x1b[36m'; // Cyan for 300s
    if (status >= 400) statusColor = '\x1b[33m'; // Yellow for 400s
    if (status >= 500) statusColor = '\x1b[31m'; // Red for 500s
    const resetColor = '\x1b[0m';

    // Log Format: [Time] INFO: METHOD URL | STATUS | TIME
    console.log(
      `[${time}] INFO: \x1b[1m${req.method}\x1b[0m ${req.originalUrl} | Status: ${statusColor}${status}${resetColor} | Response Time: ${duration}ms`
    );
  });

  next();
};

module.exports = loggerMiddleware;
