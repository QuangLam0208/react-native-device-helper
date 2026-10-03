"use strict";

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
export { multiply } from './multiply';
const LINKING_ERROR = `Thư viện 'react-native-device-helper' chưa được liên kết!\n\n` + Platform.select({
  ios: "- Bạn đã chạy 'pod install' chưa?\n",
  default: ''
}) + '- Hãy kiểm tra lại xem app đã build lại mã Native chưa.\n';
const DeviceHelperModule = NativeModules.DeviceHelperModule ? NativeModules.DeviceHelperModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
// 1. Đọc Constants tĩnh
export const getDeviceConstants = () => {
  if (Platform.OS !== 'android') return null;
  return {
    ANDROID_VERSION: DeviceHelperModule.ANDROID_VERSION,
    SDK_INT: DeviceHelperModule.SDK_INT,
    MANUFACTURER: DeviceHelperModule.MANUFACTURER,
    MODEL: DeviceHelperModule.MODEL
  };
};

// 2. Lấy thông tin phần cứng qua Promise
export const getHardwareInfo = async () => {
  return await DeviceHelperModule.getHardwareInfo();
};

// 3. Hiển thị Android Toast
export const showToast = (message, isLong = false) => {
  if (Platform.OS === 'android') {
    DeviceHelperModule.showToast(message, isLong ? 1 : 0);
  }
};

// 4. Kích hoạt Event từ Native
export const triggerNativePing = note => {
  DeviceHelperModule.triggerNativePing(note);
};

// 5. Đăng ký nhận Event
let eventEmitter = null;
if (DeviceHelperModule) {
  eventEmitter = new NativeEventEmitter(DeviceHelperModule);
}
export const subscribeToDevicePing = callback => {
  if (!eventEmitter) return () => {};
  const subscription = eventEmitter.addListener('onDeviceHelperPing', event => callback(event));
  return () => {
    subscription.remove(); // Dọn dẹp listener tránh rò rỉ RAM
  };
};
//# sourceMappingURL=index.js.map