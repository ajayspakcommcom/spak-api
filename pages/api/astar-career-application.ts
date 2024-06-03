import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File, Fields, Files } from 'formidable';
import { AStarCareerApplication } from '@/models/AStarCareerApplication';
import { Error as MongooseError } from 'mongoose';
import { Error } from 'mongoose';
import fs from 'fs';
import { sendEmail } from './utility/emailService';
import connectToMongoDB from '@/libs/mongodb';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';


export const config = {
    api: {
        bodyParser: false,
    },
};

interface ApiResponse {
    message?: string;
    error?: string;
    errorDetail?: any;
    data?: any;
}

const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});


export default async (req: NextApiRequest, res: NextApiResponse) => {

    await connectToMongoDB();
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {
        switch (req.headers.type) {
            case 'CREATE':
                try {

                    const form = new IncomingForm();
                    form.parse(req, async (err: Error, fields: Fields, files: Files) => {

                        if (err) {
                            console.error('Error parsing form:', err);
                            res.status(500).json({ error: 'Error parsing form' });
                            return;
                        }

                        // Check if there are any files uploaded
                        if (!files || !files.file) {
                            res.status(400).json({ error: 'No file uploaded' });
                            return;
                        }

                        // Ensure files.file is an array, and select the first file if it exists
                        const file = Array.isArray(files.file) ? files.file[0] : files.file;
                        const htmlContent = `<div>
                                  <b>Career Application Submission,</b>
                                  <br /><br />

                                  <b>Name : </b> <span>${fields['Name']}</span>
                                  <br />

                                 <b>Mobile : </b> <span>${fields['Mobile']}</span>
                                 <br />

                                 <b>Position : </b> <span>${fields['Designation']}</span>
                                 <br />

                                  <div style="display:inline-block; padding:15px 0;">
                                      <img src="https://astaracademy.in/img/logo.png" alt="Image" style="width:200px; height:auto;">
                                  </div>
                                </div>
                              `;

                        const result = await AStarCareerApplication.create({
                            Name: String(fields.Name),
                            Mobile: String(fields.Mobile),
                            Position: String(fields.Designation)
                        });

                        const emailSent = await sendEmail({ recipient: 'ajay@spakcomm.com', subject: 'Career Application Submission', text: htmlContent, isFile: true, files: files });

                        if (emailSent) {
                            res.status(200).json({ message: 'User Created Successfully' });
                        } else {
                            res.status(500).json({ error: 'Internal error' });
                        }
                        res.status(200).json({ message: 'File uploaded successfully' });
                    });

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
                    const dataList = await AStarCareerApplication.find({}).sort({ _id: -1 }).exec();
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

};