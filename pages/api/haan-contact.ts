// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from '@/libs/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';
import { sendEmail } from './utility/emailService';

interface ApiResponse {
  message?: string;
  error?: string;
  errorDetail?: any;
  data?: any;
}

//updated
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  await connectToMongoDB();
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {

    switch (req.body.type) {
      case 'CREATE':
        try {

          const mailContent = `<div>
                                  <p><b>Name :</b>  ${req.body.Name}</p>
                                 <p><b>Email :</b>  ${req.body.Email}</p>
                                  <p><b>Website :</b>  ${req.body.Website}</p>
                                  <p><b>Message :</b>  ${req.body.Message}</p>
                                  <div style="padding:5px 15px;"></div>
                                  <div style="padding:15px 15px;"></div>
                                  <!--<div style="display:inline-block; padding:15px 0;">
                                      <img src="https://astaracademy.in/img/logo.png" alt="Image" style="width:200px; height:auto;">
                                  </div>-->
                                </div>
                              `;

          const contactMail = await sendEmail({ recipient: 'ajay@spakcomm.com', subject: 'Haan Contact', text: mailContent });

          if (contactMail) {
            res.status(200).json({ message: 'Mail sent' });
          } else {
            res.status(500).json({ error: 'Internal error' });
          }

        } catch (error: any) {
          res.status(500).json({ error: 'Internal Error', errorDetail: error });
        }
        break;
    }

  }

}


// {
//   "Name": "John Doe",
//   "Email": "omkar@gmail.com",
//   "Website": "http://haan.migovans.com/contact.html",
//   "Message": "Hello, I am interested in your services.",
//   "type": "CREATE"
// }