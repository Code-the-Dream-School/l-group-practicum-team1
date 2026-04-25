
const user = (req, res) => {
    res.json({
        first_name: 'Seth', 
        last_name: 'Johnson',
        email: 'johnson@gmail.com',
        password: 'Johnny AppleSeed',
        created_at: new Date()
    })
}
module.exports = {user};