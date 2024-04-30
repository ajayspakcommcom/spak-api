// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from '@/libs/mongodb';
import { Test } from '@/models/Test';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

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

    switch (req.body.type) {
      case 'CREATE':
        try {

          const result = await Test.create({ reason: req.body.reason });

          console.log('Result : ', result);

          res.status(200).json({ message: 'Test Created' });
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
          const dataList = await Test.find({}).exec();
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

