// Get data from database(uat db) and sort according to birthday

import pg from "pg"; //node postgress
import dotenv from "dotenv" //loading environment variables

dotenv.config();

const client = new pg.Client({ //creating an instance of client and getting values.
    user: process.env.UAT_USER,
    host: process.env.UAT_HOST,
    database: process.env.UAT_DATABASE,
    password: process.env.UAT_PASSWORD,
    port: process.env.UAT_PORT
})

client.connect(function (error) { //function to connect with database
    if (error) {
        console.log('Error while connecting database', error)
    }
    else {
        console.log('Database Connected')
    }

    //query to select email id, employee id, employee name, dob and relation where data matches with today's date.
    client.query("select distinct on (epemailid) epemailid, employeeid, ename, dob, empcode, relation from tblcemployeedetails where to_char(dob, 'MM-DD') = to_char(current_date, 'mm-dd') order by epemailid;", (err, result) => {
        if (err) {
            console.log('Error while executing query')
        }

        let empData = result.rows; //storing result
        empData.forEach((employee) => {
            console.log(employee.ename, employee.dob.toString().slice(4, 10)) //logging employee name, dob
        })
        client.end()
    })
})