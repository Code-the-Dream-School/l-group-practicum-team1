
const user = (req, res) => {
    res.json({
        first_name: 'Seth', 
        last_name: 'Johnson',
        email: 'johnson@gmail.com',
        password: 'Johnny AppleSeed',
        created_at: new Date()
    })
}


const userLogin = (req, res) => {
    res.json({ message: 'This will be the login '})
}
module.exports = {user, userLogin};