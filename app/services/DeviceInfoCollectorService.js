import React from "react";
import {Platform} from "react-native";
import {dbServices} from "./DBServices";
import * as DeviceInfo from 'react-native-device-info';

class DeviceInfoCollectorService {

    initialize(){

        let userUniqueIdString = "user_" + DeviceInfo.getUniqueID();

        let deviceInfoObj = new Object();
        deviceInfoObj[userUniqueIdString] = {
            uniqueId: DeviceInfo.getUniqueID(),
            manufacturer: DeviceInfo.getManufacturer(),
            brand: DeviceInfo.getBrand(),
            model: DeviceInfo.getModel(),
            deviceId: DeviceInfo.getDeviceId(),
            systemName: DeviceInfo.getSystemName(),
            systemVersion: DeviceInfo.getSystemVersion(),
            bundleId: DeviceInfo.getBundleId(),
            buildNumber: DeviceInfo.getBuildNumber(),
            appVersion: DeviceInfo.getVersion(),
            readableVersion: DeviceInfo.getReadableVersion(),
            deviceName: DeviceInfo.getDeviceName(),
            userAgent: DeviceInfo.getUserAgent(),
            deviceLocale: DeviceInfo.getDeviceLocale(),
            deviceCountry: DeviceInfo.getDeviceCountry(),
            timezone: DeviceInfo.getTimezone(),
            isTablet: DeviceInfo.isTablet(),
            carrier: DeviceInfo.getCarrier(),
            phoneNumber: Platform.OS == "android" ? DeviceInfo.getPhoneNumber() : null,
            apiLevel: Platform.OS == "android" ? DeviceInfo.getAPILevel(): null
        };

        dbServices.setDBRef("deviceInfo");
        dbServices.update(deviceInfoObj);
    }
}

export let deviceInfoCollectorService = new DeviceInfoCollectorService();