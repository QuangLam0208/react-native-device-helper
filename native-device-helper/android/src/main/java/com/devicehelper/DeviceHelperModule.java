package com.devicehelper;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class DeviceHelperModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public DeviceHelperModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return "DeviceHelperModule";
  }

  // 1. Cung cấp hằng số tĩnh đọc đồng bộ (Sync Constants)
  @Override
  public Map<String, Object> getConstants() {
    Map<String, Object> constants = new HashMap<>();
    constants.put("ANDROID_VERSION", Build.VERSION.RELEASE);
    constants.put("SDK_INT", Build.VERSION.SDK_INT);
    constants.put("MANUFACTURER", Build.MANUFACTURER);
    constants.put("MODEL", Build.MODEL);
    return constants;
  }

  // 2. Hàm Bất đồng bộ: Lấy RAM & Pin qua Promise
  @ReactMethod
  public void getHardwareInfo(Promise promise) {
    try {
      // Đọc RAM
      ActivityManager actManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
      ActivityManager.MemoryInfo memInfo = new ActivityManager.MemoryInfo();
      if (actManager != null) {
        actManager.getMemoryInfo(memInfo);
      }
      double totalRamMb = memInfo.totalMem / (1024.0 * 1024.0);
      double availRamMb = memInfo.availMem / (1024.0 * 1024.0);

      // Đọc Mức Pin
      IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
      Intent batteryStatus = reactContext.registerReceiver(null, filter);
      int level = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) : -1;
      int scale = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1) : -1;
      int batteryPct = (level >= 0 && scale > 0) ? (level * 100) / scale : -1;

      int status = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1) : -1;
      boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
        status == BatteryManager.BATTERY_STATUS_FULL;

      // Đóng gói WritableMap gửi về cho React Native
      WritableMap map = Arguments.createMap();
      map.putDouble("totalRamMb", Math.round(totalRamMb));
      map.putDouble("availRamMb", Math.round(availRamMb));
      map.putInt("batteryLevel", batteryPct);
      map.putBoolean("isCharging", isCharging);
      map.putString("manufacturer", Build.MANUFACTURER);
      map.putString("model", Build.MODEL);
      map.putString("androidVersion", Build.VERSION.RELEASE);

      promise.resolve(map);
    } catch (Exception e) {
      promise.reject("HARDWARE_ERROR", "Lỗi đọc phần cứng: " + e.getMessage(), e);
    }
  }

  // 3. Thực thi hành động Native: Bắn Android Toast
  @ReactMethod
  public void showToast(String message, int duration) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        int toastDuration = (duration == 1) ? Toast.LENGTH_LONG : Toast.LENGTH_SHORT;
        Toast.makeText(reactContext, message, toastDuration).show();
      }
    });
  }

  // 4. Bắn sự kiện ngược từ Native lên JS (Event Emitter)
  @ReactMethod
  public void triggerNativePing(String customNote) {
    WritableMap eventData = Arguments.createMap();
    eventData.putString("message", "Ping từ Android: " + customNote);
    eventData.putDouble("timestamp", (double) System.currentTimeMillis());

    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("onDeviceHelperPing", eventData);
  }

  // Bắt buộc cho NativeEventEmitter
  @ReactMethod
  public void addListener(String eventName) {}

  @ReactMethod
  public void removeListeners(Integer count) {}
}
