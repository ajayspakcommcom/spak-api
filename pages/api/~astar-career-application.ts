import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File, Fields, Files } from 'formidable';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';
import fs from 'fs';
import { Test } from '@/models/Test';
import { AStarCareerApplication } from '@/models/AStarCareerApplication';




export const config = {
    api: {
        bodyParser: false,
    },
};

const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});


export default async (req: NextApiRequest, res: NextApiResponse) => {

    await runMiddleware(req, res, cors);

    const form = new IncomingForm();

    form.parse(req, async (err: Error, fields: Fields, files: Files) => {

        console.clear();
        console.log('files', files);
        console.log('fields', fields);

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

        // Read file content
        const fileContent = fs.readFileSync(file.filepath);

        const params = {
            Bucket: 'astar-bucket-app',
            Key: (file as any).originalFilename, //file.originalFilename,
            Body: fileContent,
            ContentType: (file as any).mimetype //file.mimetype,
        };

        let careerData: any = {
            Name: fields.uname![0],
            Mobile: fields.umobile![0],
            Position: fields.uposition![0]
        };

        try {
            // const resp = await s3.upload(params).promise();
            // console.log('resp', resp);

            try {
                const result = await AStarCareerApplication.create({ ...careerData, ImageUrl: 'test' });
                console.log('Data saved successfully:', result);
                res.status(200).json({ message: 'Data saved successfully' });
            } catch (error) {
                console.error('Error saving data:', error);
                res.status(500).json({ error: 'Error saving data' });
            }

            res.status(200).json({ message: 'File uploaded successfully' });
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ error: 'Error uploading file' });
        }

    });

};