// s3Routes.js
const express = require('express');
const fileUpload = require('express-fileupload');
const { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const BUCKET_NAME = 'film-client-hosting'; // <-- use your real bucket name

// S3 client setup
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Enable file upload middleware
router.use(fileUpload());

// GET /files - List objects in the bucket
router.get('/files', async (req, res) => {
  try {
    const originalData = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'original-images/'
    }));

    const resizedData = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'resized-images/'
    }));

    const originals = originalData.Contents || [];
    const resized = resizedData.Contents || [];

    // Create a mapping of filenames for easy lookup
    const resizedMap = new Map();
    resized.forEach(item => {
      const filename = item.Key.replace('resized-images/', '');
      resizedMap.set(filename, `https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key}`);
    });

    // Build list of { original, thumbnail } pairs
    const imagePairs = originals
      .filter(item => item.Key !== 'original-images/') // exclude the folder placeholder
      .map(item => {
        const filename = item.Key.replace('original-images/', '');
        return {
          original: `https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
          thumbnail: resizedMap.get(filename) || null
        };
      });

    res.json(imagePairs);
  } catch (err) {
    console.error('Error listing image files:', err);
    res.status(500).send(`Error listing image files: ${err}`);
  }
});

//POST /upload - Upload file to S3
router.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFile = req.files.file;

  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `original-images/${uploadedFile.name}`, 
      Body: uploadedFile.data
    }));
    res.send('File uploaded successfully!');
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send(`Upload error: ${err}`);
  }
});

//GET /download/:filename - Download file from S3
router.get('/download/:filename', async (req, res) => {
  const fileName = req.params.filename;

  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileName });
    const data = await s3.send(command);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');

    data.Body.pipe(res); // Stream file to client
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send(`Download error: ${err}`);
  }
});


module.exports = router;

