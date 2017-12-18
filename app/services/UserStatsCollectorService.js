import React from "react";
import {Platform} from "react-native";
import {dbServices} from "./DBServices";
import * as DeviceInfo from 'react-native-device-info';

class UserStatsCollectorService {

    initialize(){
        let userUniqueIdString = "user_" + DeviceInfo.getUniqueID();
        dbServices.setDBRef("userStats/" + userUniqueIdString);
        let userStatsObj = new Object();

        let appStartCount = 1;
        dbServices.getOnce("value")
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    let key = childSnapshot.key;
                    let childData = childSnapshot.val();

                    if (key == "appStartCount"){
                        dbServices.setDBRef("userStats");
                        appStartCount = childData + 1
                        userStatsObj[userUniqueIdString] = {
                            appStartCount : appStartCount
                        }
                        dbServices.update(userStatsObj);
                    }
                });
            })
            .catch(err => {
                dbServices.setDBRef("userStats");
                userStatsObj[userUniqueIdString] = {
                    appStartCount : appStartCount
                }
                dbServices.update(userStatsObj);
            });
    }
}

export let userStatsCollectorService = new UserStatsCollectorService();