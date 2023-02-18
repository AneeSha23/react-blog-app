import { createConnection } from 'mysql2'


 let db = createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:'social',
    port:3306
})

db.connect((err)=>{
    if(err){console.log("DB not connected....",JSON.stringify(err))}
    else{console.log("DB Connected successfully")}
})

export default db