// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from '@/libs/mongodb';
import { Counselling } from '@/models/AstarCounselling';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';
import { sendEmail } from './utility/emailService';

interface ApiResponse {
  message?: string;
  error?: string;
  errorDetail?: any;
  data?: any;
}

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  await connectToMongoDB();
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {

    console.clear();
    console.log('req.body', req.body);

    switch (req.body.type) {
      case 'CREATE':
        try {

          const htmlContent = `<div>
                                  <b>Dear ${req.body.Name},</b>
                                  <div style="padding:5px 15px;"></div>
                                  <p>Thank you for reaching out to us.</p>
                                  <p>We will get in touch soon.</p>
                                  <div style="padding:15px 15px;"></div>
                                  <div style="display:inline-block; padding:15px 0;">
                                      <img src="https://astaracademy.in/img/logo.png" alt="Image" style="width:200px; height:auto;">
                                  </div>
                                </div>
                              `;




          const emailSent = await sendEmail({ recipient: req.body.Email, subject: 'Contact Submission', text: htmlContent });


          if (emailSent) {
            res.status(200).json({ message: 'Mail sent' });
          } else {
            res.status(500).json({ error: 'Internal error' });
          }


          const ashishContent = `<div>
                                  <p><b>Name :</b>  ${req.body.Name}</p>
                                  <p><b>Address :</b>  ${req.body.Address}</p>
                                  <p><b>Mobile :</b>  ${req.body.Mobile}</p>
                                  <p><b>Qualification :</b>  ${req.body.Qualification}</p>
                                  <p><b>Email :</b>  ${req.body.Email}</p>
                                  <p><b>Age :</b>  ${req.body.Age}</p>
                                  <div style="padding:5px 15px;"></div>
                                  <div style="padding:15px 15px;"></div>
                                  <div style="display:inline-block; padding:15px 0;">
                                      <img src="https://astaracademy.in/img/logo.png" alt="Image" style="width:200px; height:auto;">
                                  </div>
                                </div>
                              `;

          const counsellingMail = await sendEmail({ recipient: 'ajay@spakcomm.com', subject: 'Free Counseling', text: ashishContent });

          if (counsellingMail) {
            res.status(200).json({ message: 'Mail sent' });
          } else {
            res.status(500).json({ error: 'Internal error' });
          }

          //res.status(200).json({ message: 'Contact Created' });
        } catch (error: any) {

          res.status(500).json({ error: 'Internal Error', errorDetail: error });
        }
        break;
    }

  }

}

