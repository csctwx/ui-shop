#!/bin/bash
# Simple script to generate the version file from the jenkins env vars

echo "BUILD_RELEASE= $GIT_COMMIT" >> build/version

echo "COMMIT_ID= $GIT_BRANCH" >> build/version

echo "BUILD_BRANCH= $GIT_BRANCH" >> build/version

echo "SRC_TAG = " >> build/version

echo "GIT_TAG = " >> build/version

echo "JOB_NAME= $JOB_NAME" >> build/version

echo "BUILD_NUMBER= $BUILD_NUMBER" >> build/version

echo "BUILD_DATE=`date`" >> build/version

echo "PACKAGE=" >> build/version
