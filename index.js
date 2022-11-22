const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");

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

    if (S3_PREFIX == '') {
      var params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${path.normalize(fileName)}`,
        Body: fileContent,
      };
    } else {
      var params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${process.env.S3_PREFIX || ""}/${path.normalize(fileName)}`,
        Body: fileContent,
      };
    }

    const acl = process.env.S3_ACL;
    if (acl) {
      params.ACL = acl;
    }

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
