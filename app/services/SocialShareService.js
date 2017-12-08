import {Platform} from "react-native";
import Share from "react-native-share";

class SocialShareService {

    isActiveProcessExists = false;

    startNativeSharing(data) {
        if (this.isActiveProcessExists) {
            return;
        }

        this.isActiveProcessExists = true;

        let shareOptions = this.createSharingOptions(data);
        Share.open(shareOptions)
            .catch((err) => {

            })

        this.isActiveProcessExists = false;
    }

    createSharingOptions(imageData) {
        const shareMessage = "Barkod Tarayıcı ile oluşturulmuştur.";
        return {
            title: "Barkod Tarayıcı",
            message: shareMessage,
            url: imageData
        };
    }
}

export let socialShareService = new SocialShareService();