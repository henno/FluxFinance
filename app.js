
import express from 'express';
import session from 'express-session';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Authentication middleware
const isAuthenticated = (req) => {
  return req.session && req.session.userId;
};

// Routes
app.get('/invoices/:id', (req, res) => {
  const invoiceId = req.params.id;
  
  // Check if user is authenticated
  if (isAuthenticated(req)) {
    // Show invoice details
    res.send(`
      <html>
        <body>
          <h1>Invoice #${invoiceId}</h1>
          <div class="invoice-details">
            <p>Invoice #${invoiceId}</p>
            <p>Amount: $100.00</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Status: Pending</p>
          </div>
        </body>
      </html>
    `);
  } else {
    // Show login form
    res.send(`
      <html>
        <body>
          <form action="${req.originalUrl}" method="POST">
            <input type="email" name="email">
            <input type="password" name="password">
            <button type="submit">Sign in</button>
          </form>
        </body>
      </html>
    `);
  }
});

// Handle login form submission
app.post('/invoices/:id', (req, res) => {
  const { email, password } = req.body;
  
  // Simple authentication (in a real app, you'd check against a database)
  if (email === 'user@example.com' && password === 'password') {
    // Set user in session
    req.session.userId = 1;
    req.session.user = { id: 1, email };
    
    // Redirect to the same URL to show the invoice
    return res.redirect(req.originalUrl);
  }
  
  // Authentication failed
  res.send(`
    <html>
      <body>
        <p>Invalid email or password</p>
        <form action="${req.originalUrl}" method="POST">
          <input type="email" name="email" value="${email || ''}">
          <input type="password" name="password">
          <button type="submit">Sign in</button>
        </form>
      </body>
    </html>
  `);
});

// Health check for Playwright
app.get('/_health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
