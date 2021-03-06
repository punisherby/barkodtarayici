package com.barkodtarayici;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.opensettings.OpenSettingsPackage;
import com.cubicphuse.RCTTorch.RCTTorchPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.rnfs.RNFSPackage;
import cl.json.RNSharePackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage()
        );
      }
    };

    @Override
    public boolean isDebug() {
      // Make sure you are using BuildConfig from your own application
      return BuildConfig.DEBUG;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
    }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
            new RCTCapturePackage(),
            new OpenSettingsPackage(),
            new RCTTorchPackage(),
            new ReactNativeConfigPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new RNFSPackage(),
            new RNSharePackage(),
            new RNViewShotPackage(),
            new RNFirebasePackage(),
            new RNDeviceInfo(),
            new RNFirebaseDatabasePackage()
    );
  }

  @Override
      public List<ReactPackage> createAdditionalReactPackages() {
            return getPackages();
    }

    @Override
    public void onCreate() {
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false);
    }
}
