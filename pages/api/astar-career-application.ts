// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from '@/libs/mongodb';
import { AStarCareerApplication } from '@/models/AStarCareerApplication';
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

                    const result = await AStarCareerApplication.create({
                        Name: req.body.Name,
                        Mobile: req.body.Mobile,
                        Position: req.body.Designation
                    });


                    const htmlContent = `<div>
                                  <b>Career Application Submission,</b>
                                  <br /><br />

                                  <b>Name : </b> <span>${req.body.Name}</span>
                                  <br />

                                 <b>Mobile : </b> <span>${req.body.Mobile}</span>
                                 <br />

                                 <b>Position : </b> <span>${req.body.Designation}</span>
                                 <br />

                                  
                                  <div style="display:inline-block; padding:15px 0;">
                                      <img src="https://astaracademy.in/img/logo.png" alt="Image" style="width:200px; height:auto;">
                                  </div>
                                </div>
                              `;


                    const emailSent = await sendEmail({ recipient: 'careers@astaracademy.com', subject: 'Career Application Submission', text: htmlContent });

                    if (emailSent) {
                        res.status(200).json({ message: 'User Created Successfully' });
                    } else {
                        res.status(500).json({ error: 'Internal error' });
                    }


                    //res.status(200).json({ message: 'Application Created' });
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
                    const dataList = await AStarCareerApplication.find({}).exec();
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

