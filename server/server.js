import express from 'express';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import { initStorage, getUser, setUser } from './storage';
import crypto from 'crypto';
import util from 'util';
import qrcode from 'qrcode';
import base32Encode from 'base32-encode';
import { verifyTOTP } from './otp';

initStorage();

const app = express();

app.use(
  cookieSession({
    secret: 'mysecret',
  })
);

app.use(bodyParser.json());

app.use(express.static('build/public'));

// Restore user from session
app.use(function (req, res, next) {
  if (req.session.username) {
    req.user = getUser(req.session.username);
  }
  next();
});

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
  } else if (req.user) {
    // try session login
    authenticatedUser = req.user;

    // require one-time password
    if (req.user.mfaEnabled && !req.session.mfaVerified) {
      return res.status(403).end();
    }
  }

  if (!authenticatedUser) {
    // no user found, destroy session and return unauthorized
    req.session = null;
    return res.status(401).end();
  }

  // strip password and mfaSecret from response
  const { password, mfaSecret, ...response } = authenticatedUser;
  res.json(response);
});

// Endpoints beyond this point must be authenticated
app.use(function (req, res, next) {
  if (!req.user) {
    return res.status(401).end();
  }
  next();
});

app.get('/mfa_qr_code', async (req, res) => {
  const user = req.user;

  // For security, we no longer show the QR code after is verified
  if (user.mfaEnabled) return res.status(404).end();

  if (!user.mfaSecret) {
    // generate unique secret for user
    // this secret will be used to check the verification code sent by user
    const buffer = await util.promisify(crypto.randomBytes)(14);
    user.mfaSecret = base32Encode(buffer, 'RFC4648', { padding: false });
    setUser(user);
  }

  const issuer = 'MfaDemo';
  const algorithm = 'SHA1';
  const digits = '6';
  const period = '30';
  const otpType = 'totp';
  const configUri = `otpauth://${otpType}/${issuer}:${user.username}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${user.mfaSecret}`;

  res.setHeader('Content-Type', 'image/png');

  //totp/MfaDemo:alan?algorithm=SHA1&digits=6&issuer=MfaDemo&period=30&secret=5CZ4UNFL54LOGJ24ZIWUHBY

  otpauth: qrcode.toFileStream(res, configUri);
});

app.post('/verify_otp', (req, res) => {
  const user = req.user;

  if (verifyTOTP(req.body.code, user.mfaSecret)) {
    user.mfaEnabled = true;
    req.session.mfaVerified = true;
    setUser(user);
    res.json(true);
  } else {
    res.json(false);
  }
});

// Routes beyond this point must have MFA verified if enabled
app.use(function (req, res, next) {
  const user = req.user;
  if (user && user.mfaEnabled && !req.session.mfaVerified) {
    return res.status(403).end();
  }
  next();
});

// Init server
app.listen(8080);

console.log('Server running on http://localhost:8080');
