# s3-upload-github-action

S3 uploader for Github Actions.

You can upload files or directories to any S3 compatible cloud buckets.

## Available ENV Variables
- File: The file you wish to upload, it can also accept folders. ex: `image.jpg` or `./images/`
- S3_PREFIX: the prefix of the uploaded file. Folder usage: `/images`
- S3_ENDPOINT: S3 Region
- S3_BUCKET: S3 Bucket
- S3_ACCESS_KEY_ID: S3 Access Key ID
- S3_SECRET_ACCESS_KEY: S3 Secret Access Key
- SKIP_FILE_PATH: if true, it will skip the complete file path and only use the filename as key. example: `/folder_1/folder_2/folder_3/image.jpg` will be uploaded to `image.jpg` instead of all the path.

## Usage

See the following example.

```YAML
# inside .github/workflows/action.yml
name: Add File to Bucket
on: push

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@master

      - name: Upload file to bucket
        uses: koraykoska/s3-upload-github-action@master
        env:
          FILE: ./releases/
          S3_ENDPOINT: 'ams3.digitaloceanspaces.com'
          S3_BUCKET: ${{ secrets.S3_BUCKET }}
          S3_ACCESS_KEY_ID: ${{ secrets.S3_ACCESS_KEY_ID }}
          S3_SECRET_ACCESS_KEY: ${{ secrets.S3_SECRET_ACCESS_KEY }}
```
