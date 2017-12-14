import React from "react";
import {Platform, AsyncStorage} from "react-native";
import DropdownAlert from 'react-native-dropdownalert';

class DropDownAlertService {

    barcodeScanInfoHeaderText = "Genel Bilgi ve Formatlar"
    barcodeScanInfoText = "Akıllı Kamera sayesinde ürün Barkodları, Etkinlik, Wifi vb. QR kodları tanınır ve paylaşılabilir.\n" +
        "Desteklenen Formatlar :\n" +
        "QR Code\n" +
        "UPC-A, " + "UPC-E, " + "UPC_EAN_EXTENSION\n" +
        "EAN-8, " + "EAN-13\n" +
        "Code 39, " + "Code 93, " + "Code 128\n" +
        "Aztec (beta)\n" +
        "Data Matrix\n" +
        "Codabar\n" +
        "PDF 417 (beta)\n" +
        "ITF\n" +
        "MaxiCode\n" +
        "RSS-14, " + "RSS-Expanded";

    QREventGeneratorInfoHeaderText = "QR Etkinlik Kodu Yaratma"
    QREventGeneratorInfoText = "Düzenleyeceğiniz Etkinlik Davetleri için QR Kod yaratmanızı sağlar. Bir teknoloji semineri, bir toplantı daveti, bir parti vb. olabilir.";

    QREventGeneratorTimeFormatErrorHeaderText = "Geçerli bir tarih saat formatı girin";
    QREventGeneratorTimeFormatErrorText = "Tarih Saat Formatı şu şekilde olmalıdır \n Gün/Ay/Yıl Saat:Dakika \n Örn: 24/12/2017 10:30";

    QRWifiGeneratorInfoHeaderText = "QR Wifi Kodu Yaratma";
    QRWifiGeneratorInfoText = "WIFI Ayarlarını QR Kod haline getirip paylaşmanız güvenliğizi arttırır. Kafe, Restoran gibi işyerleriniz için bu şekilde bir kullanım da tavsiye ederiz.";

    renderDropDownElement(thisRef, numOfLines, closeInterval, infoColor= "#41bfeb", errorColor = "#cc3232", ) {
        return (
            <DropdownAlert ref={ref => thisRef.dropdown = ref} messageNumOfLines={numOfLines} closeInterval={closeInterval} infoColor={infoColor} errorColor={errorColor}/>
        )
    }

}

export let dropDownAlertService = new DropDownAlertService();