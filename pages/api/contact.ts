// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from '@/libs/mongodb';
import { Contact } from '@/models/Contact';
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

          const result = await Contact.create({
            Name: req.body.Name,
            Email: req.body.Email,
            Mobile: req.body.Mobile,
            QueryMessage: req.body.QueryMessage
          });

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
            res.status(200).json({ message: 'User Created Successfully' });
          } else {
            res.status(500).json({ error: 'Internal error' });
          }

          //res.status(200).json({ message: 'Contact Created' });
        } catch (error: any) {

          if (error instanceof Error.ValidationError) {
            return res.status(400).json({ error: `Validation Error`, errorDetail: error.message });
          }

          if (error instanceof Error.CastError) {
            return res.status(400).json({ error: `Cast Error`, errorDetail: error.message });
          }

          if (error.code === 11000) {
            return res.status(400).json({ error: `Duplicate Key Error`, errorDetail: error.message });
          }

          res.status(500).json({ error: 'Internal Error', errorDetail: error });
        }
        break;
      case 'LIST':
        try {
          const dataList = await Contact.find({}).exec();
          res.status(200).json({ data: dataList });
        } catch (error: any) {

          if (error instanceof MongooseError) {
            return res.status(500).json({ error: 'Database Error', errorDetail: error });
          }
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
    }

  }

}

