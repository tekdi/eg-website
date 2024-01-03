#!/bin/bash

aws s3 sync prod-build s3://$AWS_S3_BUCKET --acl public-read --delete --region $AWS_REGION

# Check the exit code
if [ $? -ne 0 ]; then
    echo "S3 Sync failed. Handling error..."
    # Add your error handling logic here
    exit 1  # Exit with a failure status
else
    echo "S3 Sync successful."
    # Continue with the workflow
fi
