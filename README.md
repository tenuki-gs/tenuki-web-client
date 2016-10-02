# Tenuki Web Client

A static web application

## Running

```bash
npm install
npm start
```

## Deploying

```bash
aws s3 website s3://tenuki.cafe --index-document=index.html
aws s3 cp \
    --recursive \
    --grants="read=uri=http://acs.amazonaws.com/groups/global/AllUsers" \
    ./tenuki s3://tenuki.cafe
```
