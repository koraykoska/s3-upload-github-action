const aws = require("aws-sdk");
const fs = require("fs");

const spacesEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const uploadFile = (fileName) => {
  if (fs.lstatSync(fileName).isDirectory()) {
    fs.readdirSync(fileName).forEach((file) => {
      uploadFile(`${fileName}/${file}`);
    });
  } else {
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: fileContent,
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successful. ${data.Location}`);
    });
  }
};

uploadFile(process.env.FILE);