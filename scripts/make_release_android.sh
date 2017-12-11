#!/bin/sh

APP_DEPLOYMENT_ENVIRONMENT=$1
BUILD_NUMBER=$2;
BUNDLE_SHORT_VERSION=$3;
RELEASE_INFO_FILE="release_info.txt"

if [ "$APP_DEPLOYMENT_ENVIRONMENT" == "staging" ] || [ "$APP_DEPLOYMENT_ENVIRONMENT" == "production" ]; then
    echo "APP Environment: '$APP_DEPLOYMENT_ENVIRONMENT'"
else
   echo " "
   echo "Unknown environment: '$APP_DEPLOYMENT_ENVIRONMENT'. Aborting..."
   echo " "
   exit -1
fi

if [ -z "$BUILD_NUMBER" ] || [ "$BUILD_NUMBER" == "" ] ; then
    echo " "
    echo "Unknown Build number. Aborting..."
    echo " "
    exit -1
fi

if [ -z "$BUNDLE_SHORT_VERSION" ] || [ "$BUNDLE_SHORT_VERSION" == "" ] ; then
    echo " "
    echo "Unknown bundle short version. Aborting..."
    echo " "
    exit -1
fi

# Go to top project folder:
SCRIPT_DIRECTORY=`dirname $0`
cd ${SCRIPT_DIRECTORY}
cd .. 

echo "====================================================="
echo "Deleting npm packages..."
echo "====================================================="
rm -rf ./node_modules || exit

echo "====================================================="
echo "Installing npm packages..."
echo "====================================================="
npm install || exit

echo "====================================================="
echo "Processing manual updates"
echo "====================================================="
sed -i -e "s/require('fs')/require('react-native-fs')/g" node_modules/lokijs/src/lokijs.js


echo "====================================================="
echo "Verifying npm cache..."
echo "====================================================="
npm cache verify || exit

# Go to android folder to create ipa file
cd ./android

echo "====================================================="
echo "Archiving to ../dist"
echo "====================================================="

if [ "$APP_DEPLOYMENT_ENVIRONMENT" == "staging" ]; then
    ENVFILE=.env.staging ./gradlew installStaging -PversionCode=$BUILD_NUMBER -PversionName=$BUNDLE_SHORT_VERSION || exit
    SCHEME="Staging"
elif [ "$APP_DEPLOYMENT_ENVIRONMENT" == "production" ]; then
    ENVFILE=.env.production ./gradlew assembleRelease -PversionCode=$BUILD_NUMBER -PversionName=$BUNDLE_SHORT_VERSION || exit
    SCHEME="Production"
fi

# Let's print where we are
echo "====================================================="
echo "Moving apk to dist folder"
echo "====================================================="
if [ "$APP_DEPLOYMENT_ENVIRONMENT" == "staging" ]; then
    mv app/build/outputs/apk/app-staging.apk ../dist/${SCHEME}.apk || exit
elif [ "$APP_DEPLOYMENT_ENVIRONMENT" == "production" ]; then
    mv app/build/outputs/apk/app-release.apk ../dist/${SCHEME}.apk || exit
fi

echo "====================================================="
echo "RELEASE COMPLETED!"
echo "====================================================="
