import { isArray } from 'util';

const fs = require('fs');

const storagePath = './storage';
const usersPath = `${storagePath}/users.json`;

const initialUsers = {
  alan: {
    username: 'alan',
    password: '1',
  },
  jhon: {
    username: 'jhon',
    password: '2',
  },
};

export function initStorage() {
  if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
  if (!fs.existsSync(usersPath)) setUsers(initialUsers);
}

export function getUser(username) {
  return getUsers()[username];
}

export function setUser(user) {
  const users = getUsers();
  users[user.username] = user;
  setUsers(users);
}

function getUsers() {
  let users;
  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath).toString());
  }
  return users || {};
}

function setUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}
