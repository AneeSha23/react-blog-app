
import db from '../db.js'
import jwt from 'jsonwebtoken'
import moment from 'moment/moment.js'
export const getComments = (req, res) => {
   
    const token = req.cookies.access_token
    // console.log("token",token)

    if (!token) return res.status(401).json("Not loggedIn!..")
    jwt.verify(token, "secret-key", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid")

        const q = `SELECT c.*, u.id AS userId,name,pro_pic FROM comments AS c 
                   JOIN 
                   user AS u ON (u.id = c.userid)
                   WHERE
                   c.postid=? 
                   ORDER BY c.created_at DESC
                   `


        db.query(q, [req.query.postid], (err, data) => {
            if (err) { return res.status(500).send(err) }
            else {
               return res.send(data)
                // console.log(data)
            }
        })

    }) 

}

export const addComment= (req,res)=>{
    const token = req.cookies.access_token

    if(!token){return res.status(401).json("user not loggedIn!")}
    jwt.verify(token,"secret-key", (err,userInfo)=>{
        if(err){return res.status(403).send("Token is not valid")}
        const q = `INSERT INTO comments(description,userid,created_at,postid) VALUES(?)`
        const values = [
            req.body.description,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            req.body.postid
        ]

        db.query(q,[values],(err,data)=>{
            if(err){return res.status(500).send(err)}
            else{
                return res.status(200).json("New Comment created")
            }
        })
    })
}