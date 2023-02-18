import db from '../db.js'
import jwt from 'jsonwebtoken'
import moment from 'moment/moment.js'

export const getPosts = (req, res) => {

    const token = req.cookies.access_token
    // console.log("token",token)

    if (!token) return res.status(401).json("Not loggedIn!..")
    jwt.verify(token, "secret-key", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid")

        const q = `SELECT p.*, u.id AS userId,name,pro_pic FROM posts AS p 
                   JOIN 
                   user AS u ON (u.id = p.userid)
                   LEFT JOIN
                   relationship AS r ON (p.userid = r.followeduserid)
                   WHERE
                   r.followerid = ? OR p.userid = ? 
                   ORDER BY p.created_at DESC
                   `


        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) { return res.status(500).send(err) }
            else {
               return res.send(data)
                // console.log(data)
            }
        })

    })

    /*  to get current user--> 
        the user data stored in cookie. 
        Cookie contains token, 
        the token contains the user detail, 
        by using token we can reach the user details
    */

    /*  select all posts
     const q = `SELECT * FROM posts`*/


    /*  get all posts with users detail who posts that post
    const q = `SELECT p.*, u.id AS userId,name,pro_pic FROM posts AS p JOIN user AS u ON (u.id = p.userid)`*/

    /*To show only current user and their friends post*/

}

export const addPost = (req,res)=>{
    const token = req.cookies.access_token

    if(!token){return res.status(401).json("user not loggedIn!")}
    jwt.verify(token,"secret-key", (err,userInfo)=>{
        if(err){return res.status(403).send("Token is not valid")}
        const q = `INSERT INTO posts(description,image,userid,created_at) VALUES(?)`
        const values = [
            req.body.description,
            req.body.image,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ]

        db.query(q,[values],(err,data)=>{
            if(err){return res.status(500).send(err)}
            else{
                return res.status(200).json(" New Post created")
            }
        })
    })
}