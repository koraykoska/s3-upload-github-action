const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Add Array.last functionality
if (!Array.prototype.hasOwnProperty("last")) {
  Object.defineProperty(Array.prototype, "last", {
    get() {
      return this[this.length - 1];
    }
  });
}

const spacesEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const skipFilePath = process.env.SKIP_FILE_PATH || false

const uploadFile = (fileName) => {
  if (fs.lstatSync(fileName).isDirectory()) {
    fs.readdirSync(fileName).forEach((file) => {
      uploadFile(`${fileName}/${file}`);
    });
  } else {
    const fileContent = fs.readFileSync(fileName);
    let fileNameToUse = skipFilePath ? fileName.split('/').last : fileName

    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${process.env.S3_PREFIX || ""}/${path.normalize(fileNameToUse)}`,
      Body: fileContent,
    };
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
