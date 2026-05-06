//Register
const register = (req, res) => {
  res.json({
    first_name: "Seth",
    last_name: "Johnson",
    email: "johnson@gmail.com",
    password: "Johnny AppleSeed",
    created_at: new Date(),
  });
};

//Login ---> awaiting Prisma and data base string
const login = (req, res) => {
  res.json({ message: "This will be the login " });
};

//Logout
const logout = (req, res) => {
  res.end("user has logged out");
};

module.exports = { register, login, logout };
