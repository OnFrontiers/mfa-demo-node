import express from 'express';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import { initStorage, getUser } from './storage';

initStorage();

const app = express();

app.use(
  cookieSession({
    secret: 'mysecret',
  })
);

app.use(bodyParser.json());

app.use(express.static('build/public'));

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.post('/login', (req, res) => {
  let authenticatedUser;

  const { body } = req;
  if (body.username) {
    // try password login
    const user = getUser(body.username);
    if (user && user.password === body.password) {
      authenticatedUser = user;
      // create session
      req.session.username = body.username;
    }
  } else if (req.session.username) {
    // try session login
    authenticatedUser = getUser(req.session.username);
  }

  if (!authenticatedUser) {
    // no user found, destroy session and return unauthorized
    req.session = null;
    return res.status(401).end();
  }

  // strip password from response
  const { password, ...response } = authenticatedUser;
  res.json(response);
});

app.listen(8080);

console.log('Server running on http://localhost:8080');
