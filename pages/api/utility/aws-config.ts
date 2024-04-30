import AWS, { S3 } from 'aws-sdk';


// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Create an instance of the S3 service
const s3: S3 = new AWS.S3();


export default s3;