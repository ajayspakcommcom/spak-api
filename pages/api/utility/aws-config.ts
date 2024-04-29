import AWS, { S3 } from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: 'AKIA5QTMXGLUWJ7PNHZS',
    secretAccessKey: 'nJDGPsF0A8ppw+/MwmaNujXoZZ2k2gLRXWG0fW8O',
    region: 'ap-south-1', // e.g., 'us-east-1'
});

// Create an instance of the S3 service
const s3: S3 = new AWS.S3();

export default s3;