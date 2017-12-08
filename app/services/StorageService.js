import { AsyncStorage } from "react-native";

// READ THE NOTE BELOW FOR ANY CHANGE FOR THIS MAP !!!!!!
export const STORAGE_KEYS = {
    ACTIVE_SWIPE_NUMBER: "activeSwiperPageNumber",
    AUTH_INFO: "AUTH_INFO", // authInfo
    CUSTOMER_ZIPCODE: "CUSTOMER_ZIPCODE",
    CUSTOMER_PHOTO_SOURCES: "CustomerPhotoSources",
    CUSTOMER_IS_PROFILE_COMPLETED: "isProfileCompleted",
    USER: "user",
    USER_FIRST_ENTER_PROFILE: "USER_FIRST_ENTER_PROFILE",
    WELCOME_PHOTOS: "welcomePhotos",
    TAKE_PHOTO_CLICKING: "TAKE_PHOTO_CLICKING",
    REMIND_CONCERN_FLAG: "remindConcernFlag",
    INITIAL_WEIGHT_POUNDS: "INITIAL_WEIGHT_POUNDS",
    MEAL_PLANNING_FIRST_OPEN_SWIPE_MENU: "MEAL_PLANNING_FIRST_OPEN_SWIPE_MENU",
    SHOWED_RECIPE_LIST_INFO: "SHOWED_RECIPE_LIST_INFO" // TODO(tayfun) : flagged for removal, this key is not used since 10.07.2017
};

// NOTE !!!!!!
// if we plan to change any key value we should put end of the array
// previous one to here !
// mapping is like this : [new value] <-> [old value]
// so that we can reach previous key's value with new value
const PREVIOUS_STORAGE_KEYS = {
    AUTH_INFO: ["authInfo"],
    activeSwiperPageNumber: ["activeSwiperPageNumber"],
    CUSTOMER_ZIPCODE: ["CUSTOMER_ZIPCODE"],
    CustomerPhotoSources: ["CustomerPhotoSources"],
    isProfileCompleted: ["isProfileCompleted"],
    user: ["user"],
    USER_FIRST_ENTER_PROFILE: ["USER_FIRST_ENTER_PROFILE"],
    welcomePhotos: ["welcomePhotos"],
    TAKE_PHOTO_CLICKING: ["TAKE_PHOTO_CLICKING"],
    remindConcernFlag: ["remindConcernFlag"],
    INITIAL_WEIGHT_POUNDS: ["INITIAL_WEIGHT_POUNDS"],
    SHOWED_RECIPE_LIST_INFO: ["SHOWED_RECIPE_LIST_INFO"]
};

const USER_BASED_STORAGE_KEYS = [
    STORAGE_KEYS.ACTIVE_SWIPE_NUMBER,
    STORAGE_KEYS.CUSTOMER_PHOTO_SOURCES,
    STORAGE_KEYS.CUSTOMER_IS_PROFILE_COMPLETED,
    STORAGE_KEYS.USER_FIRST_ENTER_PROFILE,
    STORAGE_KEYS.TAKE_PHOTO_CLICKING,
    STORAGE_KEYS.REMIND_CONCERN_FLAG,
    STORAGE_KEYS.INITIAL_WEIGHT_POUNDS,
    STORAGE_KEYS.SHOWED_RECIPE_LIST_INFO
]

export const STORAGE_KEYS_TO_MULTI_REMOVE = [
    STORAGE_KEYS.USER,
    STORAGE_KEYS.CUSTOMER_IS_PROFILE_COMPLETED,
    STORAGE_KEYS.AUTH_INFO,
    STORAGE_KEYS.CUSTOMER_ZIPCODE
];

class StorageService {

    set = async (key, data) => {
        if (USER_BASED_STORAGE_KEYS.includes(key)) {
            let uuid = await this.getUUID();
            let customerStorageStr = await AsyncStorage.getItem(uuid);
            let customerStorage = JSON.parse(customerStorageStr);

            if (!customerStorage) {
                customerStorage = {};
            }
            customerStorage[key] = data;
            return AsyncStorage.setItem(uuid, JSON.stringify(customerStorage));
        } else {
            return AsyncStorage.setItem(key, JSON.stringify(data));
        }
    };

    get = (key) => {
        return new Promise(async (resolve, reject) => {
            if (key) {
                let result;

                if (USER_BASED_STORAGE_KEYS.includes(key)) {
                    let uuid = await this.getUUID();
                    let customerStorageStr = await AsyncStorage.getItem(uuid);
                    let customerStorage = JSON.parse(customerStorageStr);
                    if (customerStorage && customerStorage[key] !== undefined) {
                        result = customerStorage[key];
                    } else {
                        result = this._getWithPreviousKey(key);
                    }
                } else {
                    let dataStr = await AsyncStorage.getItem(key);
                    if (dataStr === null) {
                        result = this._getWithPreviousKey(key);
                    } else {
                        result = dataStr ? JSON.parse(dataStr) : null;
                    }
                }
                resolve(result);
            } else {
                reject("no key");
            }
        });
    }

    _getWithPreviousKey = (key) => {
        let result = null;
        let previousKeys = PREVIOUS_STORAGE_KEYS[key];

        if (previousKeys) {
            previousKeys.forEach(async (previousKey) => {
                let previousKeyDataStr = await AsyncStorage.getItem(previousKey);
                let previousKeyData = JSON.parse(previousKeyDataStr);

                if (previousKeyData !== undefined && !result !== null) {
                    await this.set(key, previousKeyData);
                    result = previousKeyData;
                }
                await AsyncStorage.removeItem(previousKey);
            });
        }

        return result;
    }

    clear = () => {
        STORAGE_KEYS_TO_MULTI_REMOVE.forEach(async (key) => {
            await this.remove(key);
        });
    }

    remove = (key) => {
        return new Promise(async (resolve, reject) => {
            if (USER_BASED_STORAGE_KEYS.includes(key)) {
                let uuid = await this.getUUID();
                let customerStorageStr = await AsyncStorage.getItem(uuid);
                let customerStorage = JSON.parse(customerStorageStr);

                if (customerStorage && customerStorage[key] !== undefined) {
                    customerStorage[key] = null;                
                    await AsyncStorage.setItem(uuid, JSON.stringify(customerStorage));
                }

                let previousKeys = PREVIOUS_STORAGE_KEYS[key];

                if (previousKeys) {
                    previousKeys.forEach((previousKey) => {
                        AsyncStorage.removeItem(previousKey);
                    });
                }
            } else {
                await AsyncStorage.removeItem(key);
            }

            resolve();
        });
    }

    update = (key, newValue) => {
        return new Promise(async (resolve, reject) => {
            if (USER_BASED_STORAGE_KEYS.includes(key)) {
                let uuid = await this.getUUID();
                let customerStorageStr = await AsyncStorage.getItem(uuid);
                let customerStorage = JSON.parse(customerStorageStr);
                let data;
                if(customerStorage) {
                    data = Object.assign(...customerStorage[key], ...newValue);
                } else {
                    data = {};
                    data[key] = newValue;
                }
                
                await AsyncStorage.setItem(uuid, JSON.stringify(data));
            } else {
                await AsyncStorage.mergeItem(key, JSON.stringify(newValue));
            }

            resolve();
        });
    }

    getUUID = async () => {
        let authInfoStr = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_INFO);
        let authInfo = JSON.parse(authInfoStr);
        return authInfo ? authInfo.uuid : "";
    };
}
export let storageService = new StorageService();