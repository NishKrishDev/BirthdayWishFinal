//Final Feature

import pg from "pg"; //node postgress
import dotenv from "dotenv"; //loading environment variables
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

dotenv.config();

const connesctionUrl = process.env.CONN_URL; //elephant sql database url

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY //creating an instance and storing the value of mailer send api key
})

const sendFrom = new Sender('care@gili.pro', 'care@gili.pro'); //setting sender name

let client = new pg.Client(connesctionUrl);

client.connect((error) => { //connecting with database
    if (error) {
        console.log('Error while connectin database', error)
    }

    //postgres query to get employee details with respect to their birthday
    client.query("select distinct on (email) * from TestEmployees where to_char(dob, 'MM-DD') = to_char(current_date, 'mm-dd')",
        (err, result) => {
            if (err) {
                console.log('Error while executing query');
            }
            let empData = result.rows;

            for (let i = 0; i < empData.length; i=i+2) //sending mail to 2 employees at a time
            {
                let j = i + 2;
                let mailSendTo = empData.slice(i, j);
                mailSendTo.forEach((employee) => { //targeting each employee separately
                    let emailParms = new EmailParams()
                        .setFrom(sendFrom)
                        .setTo([new Recipient(employee.email, employee.name)])
                        .setSubject(`Happy Birthday ${employee.name}`)
                        .setHtml( //html template
                            `
                            <div style="background-color: #f0f0f0; font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                            <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                <h1 style="color: #ff4500;">Happy Birthday ${employee.name}</h1>
                                <p style="font-size: 18px;">Dear ${employee.name},</p>
                                <p style="font-size: 18px;">Wishing you a very Happy Birthday from all of us at Gili Pro! 🎂🎉</p>
                                <p style="font-size: 18px;">As a valued member of our insurance family, we would like to take this opportunity to celebrate your special day and express our heartfelt appreciation for your trust and loyalty.</p>
                                <p style="font-size: 18px;">Your journey with us is important, and we're committed to being there for you whenever you need us. Whether it's safeguarding your family's future, protecting your investments, or providing peace of mind, we're here to support you every step of the way.</p>
                                <p style="font-size: 18px;">On this special occasion, we hope you have a day filled with joy, surrounded by loved ones, and marked by memorable moments. May the coming year bring you even more prosperity, good health, and success.</p>
                                <p style="font-size: 18px;">If you ever have any questions, need assistance, or wish to explore our insurance offerings further, please don't hesitate to reach out to our dedicated team. We're here to help you with all your insurance needs.</p>
                                <p style="font-size: 18px;">Once again, Happy Birthday! Enjoy your day to the fullest, and know that we are here, ready to assist you with any insurance-related concerns you may have.</p>
                                <p style="font-size: 18px;">Best wishes for a fantastic year ahead!</p>
                                <p style="font-size: 18px;"><br></p>
                                <p style="font-size: 18px;">Warm regards,</p>
                                <p style="font-size: 18px;">gili pro</p>
                            </div>
                        </div>
                        <a href='https://docs.google.com/forms/d/e/1FAIpQLSf83jecklDpkZmLGw7KZvfcCVga_z2a6gDUey-br0F7klYcEw/viewform'><button style="background-color: #ff4500; color: white; padding: 8px; border: #ff4500; border-radius: 5px; cursor: pointer;">Unsubscribe</button></a>
                        </div>
                    `
                        )
                    mailerSend.email //sending mail
                        .send(emailParms)
                        .then((response) => { console.log(response.statusCode) })
                        .catch((error) => { console.log(error) })
                })

            }

            console.log('Execution Completed')
            client.end()
        })
})