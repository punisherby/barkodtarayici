import React from "react";
import {Platform} from "react-native";
import {dbServices} from "./DBServices";
import * as DeviceInfo from 'react-native-device-info';

class UserStatsCollectorService {

    initialize(){
        let userUniqueIdString = "user_" + DeviceInfo.getUniqueID();
        dbServices.setDBRef("userStats/" + userUniqueIdString);

        let appStartCount = 0;
        dbServices.getOnce("value")
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    let key = childSnapshot.key;
                    let childData = childSnapshot.val();

                    if (key == "appStartCount"){
                        appStartCount = childData + 1

                        let userStatsObj = new Object();
                        userStatsObj[userUniqueIdString] = {
                            appStartCount : appStartCount
                        }
                        dbServices.setDBRef("userStats");
                        dbServices.update(userStatsObj);
                    }
                });
            });
    }
}

export let userStatsCollectorService = new UserStatsCollectorService();