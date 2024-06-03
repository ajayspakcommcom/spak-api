
import nodemailer from 'nodemailer';
import path from 'path';

interface EmailData {
    recipient: string;
    subject: string;
    text: string;
    isFile?: boolean;
    files?: any
}

const sendEmail = async ({ recipient, subject, text, isFile = false, files }: EmailData): Promise<boolean> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info@astaracademy.in',
            pass: 'jyiliqqxpgxomujn'
        },
    });

    const mailOptions: any = {
        //from: 'info@astaracademy.in',
        from: 'info@astaracademy.in',
        to: recipient,
        subject: subject,
        html: `${text}`,
        // attachments: [{
        //     //filename: 'dummy.pdf',
        //     //path: path.resolve(__dirname, 'dummy.pdf')
        // }]
    };

    if (isFile && files && files.file && files.file.length > 0) {
        const file = files.file[0]; // Assuming there's only one file
        mailOptions.attachments = [{
            filename: file.originalFilename,
            path: file.filepath
        }];
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true; // Email sent successfully
    } catch (error) {
        console.error('Error sending email:', error);
        return false; // Email sending failed
    }
};

export { sendEmail };