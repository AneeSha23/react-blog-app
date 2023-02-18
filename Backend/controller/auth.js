import db from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {

    // CHECK IF USER EXIST OR NOT
    let q = `SELECT * FROM user WHERE email = ? OR username = ?`

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) {
            return res.status(409).send(err)
        }
        // WHEN USER EXIST
        if (data.length) {
            return res.status(409).send("Username or email Already existed")
        }
        // HASH PASSWORD
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(req.body.password, salt)
        // IF USER NOT EXISTED ADD DATA TO THE DB
        const q = "INSERT INTO user(username,email,password,name) VALUE (?)"

        const values = [
            req.body.username,
            req.body.email,
            hashPassword,
            req.body.name,

        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                res.status(409).send(err)
            }
            else {
                res.send("user created successfully")
            }
        })

    })

}

export const login = (req, res) => {
    // CHECK IF USER EXIST OR NOT
    let q = `SELECT * FROM user WHERE username = ?`

    db.query(q, [req.body.username], (err, data) => {
        if (err) { return res.status(500).send(err) }
        if (data.length === 0) { return res.status(409).json("user not found") }
        // CHECK PASSWORD
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)

        if (!checkPassword) { res.status(409).send("wrong password") }

        const token = jwt.sign({ id: data[0].id }, "secret-key")
        const { password, ...other } = data[0]
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)


    })

}

export const logout = (req, res) => {
    res.clearCookie("access_token",{
        secure:true,
        sameSite:"none"
    })
    .status(200)
    .send("User logged out successfully...")
}