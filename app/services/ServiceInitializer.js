import {optionsService} from "./OptionsService";
import {dbServices} from "./DBServices";
import {deviceInfoCollectorService} from "./DeviceInfoCollectorService";
import {userStatsCollectorService} from "./UserStatsCollectorService";

export const initializeServices = () => {
    dbServices.initialize();
    deviceInfoCollectorService.initialize();
    optionsService.initialize();
}