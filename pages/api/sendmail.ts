import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const sendMailHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if ('honeypot' in req.body && req.body.honeypot !== '') {
    // It's likely a bot if the honeypot field is filled out
    console.log('Honeypot field was filled out.');
    return res.status(400).json({ message: 'Honeypot field was filled out.' });
  }
  
  if (req.method === 'POST') {
    const { name, email, message } = req.body as { name: string; email: string; message: string };

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER, // Your SMTP host
      port: parseInt(process.env.EMAIL_PORT || '465'), // Convert port to a number
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // SMTP username from environment variable
        pass: process.env.EMAIL_PASSWORD, // SMTP password from environment variable
      },
    });

    // Define the email options
    const mailOptions = {
      from: `"Kontaktformulär" <${process.env.EMAIL_USER}>`, // Sender address from environment variable
      to: process.env.EMAIL_TO, // Receiver, taken from the form input
      subject: 'New Contact Form Submission', // Subject line
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Plain text body
      // html: `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong> ${message}`, // HTML body
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error: any) {
      console.error('Error sending email: ', error);
      
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      res.status(500).json({ error: 'Error sending email', details: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default sendMailHandler;