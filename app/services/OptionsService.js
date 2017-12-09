import {Platform, AsyncStorage} from "react-native";

class OptionsService {

    firstTimeProcess = true;
    defaultOptions = [true, false, true];
    options = [true, false, true];

    getDefaultOptions() {
        return this.defaultOptions;
    }

    async resetToDefaultOptions() {
        this.options = {...this.defaultOptions};

        try {
            await AsyncStorage.setItem('options' , JSON.stringify(this.options));
        } catch (error) {
            return this.options;
        }

        return this.options;
    }

    async getOptions() {
        if (this.firstTimeProcess) {
            let value;
            try {
                value = await AsyncStorage.getItem('options');
                this.firstTimeProcess = false;
            }catch(error) {
                return this.defaultOptions;
            }

            if(value) {
                this.options = JSON.parse(value);
                return this.options;
            } else {
                return this.defaultOptions;
            }
        } else {
            return this.options;
        }
    }

    async setOptions(optionNumber) {
        let tmpOptionArray = {...this.options};
        tmpOptionArray[optionNumber] = !tmpOptionArray[optionNumber];

        try {
            await AsyncStorage.setItem('options' , JSON.stringify(tmpOptionArray));
        } catch (error) {
            return this.options;
        }
        this.options = {...tmpOptionArray}
        return this.options;
    }

    getSingleOption(optionId) {
        return this.options[optionId];
    }
}

export let optionsService = new OptionsService();