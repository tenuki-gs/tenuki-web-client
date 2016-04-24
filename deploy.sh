BUILD_PATH=build
S3_BUCKET=tenuki.cafe

# Copy static files into build directory.
mkdir -p $BUILD_PATH
cp ./tenuki/index.html $BUILD_PATH/index.html

# Bundle static files. See webpack.config.js.
webpack

# Deploy to S3 bucket.
aws s3 $TENUKI_AWS_OPTIONS website s3://$S3_BUCKET --index-document=index.html
aws s3 $TENUKI_AWS_OPTIONS cp \
    --recursive \
    --grants="read=uri=http://acs.amazonaws.com/groups/global/AllUsers" \
    $BUILD_PATH s3://$S3_BUCKET
