// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from '@/libs/mongodb';
import { Admission } from '@/models/Admission';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';
import { AStarCareerApplication } from '@/models/AStarCareerApplication';

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

        try {

            // const result = await AStarCareerApplication.create({
            //     Name: fields.uname![0],
            //     Mobile: fields.umobile![0],
            //     Position: fields.uposition![0]
            // });

            console.log('Ram');
            console.log('req.body', req.body);

            res.status(200).json({ message: 'Admission Created' });
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

    }

}

