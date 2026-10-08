import { NativeModules, NativeEventEmitter, Platform } from "react-native"

const LINKING_ERROR =
  `Thư viện 'native-device-helper' chưa được liên kết!\n\n` +
  Platform.select({ ios: "- Bạn đã chạy 'pod install' chưa?\n", default: "" }) +
  "- Hãy kiểm tra lại xem app đã build lại mã Native chưa.\n"

const DeviceHelperModule = NativeModules.DeviceHelperModule
  ? NativeModules.DeviceHelperModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR)
        },
      },
    )

export interface HardwareInfo {
  totalRamMb: number
  availRamMb: number
  batteryLevel: number
  isCharging: boolean
  manufacturer: string
  model: string
  androidVersion: string
}

export interface DeviceConstants {
  ANDROID_VERSION: string
  SDK_INT: number
  MANUFACTURER: string
  MODEL: string
}

// 1. Đọc Constants tĩnh
export const getDeviceConstants = (): DeviceConstants | null => {
  if (Platform.OS !== "android") return null
  return {
    ANDROID_VERSION: DeviceHelperModule.ANDROID_VERSION,
    SDK_INT: DeviceHelperModule.SDK_INT,
    MANUFACTURER: DeviceHelperModule.MANUFACTURER,
    MODEL: DeviceHelperModule.MODEL,
  }
}

// 2. Lấy thông tin phần cứng qua Promise
export const getHardwareInfo = async (): Promise<HardwareInfo> => {
  return await DeviceHelperModule.getHardwareInfo()
}

// 3. Hiển thị Android Toast
export const showToast = (message: string, isLong = false): void => {
  if (Platform.OS === "android") {
    DeviceHelperModule.showToast(message, isLong ? 1 : 0)
  }
}

// 4. Kích hoạt Event từ Native
export const triggerNativePing = (note: string): void => {
  DeviceHelperModule.triggerNativePing(note)
}

// 5. Đăng ký nhận Event
let eventEmitter: NativeEventEmitter | null = null
if (DeviceHelperModule) {
  eventEmitter = new NativeEventEmitter(DeviceHelperModule)
}

export const subscribeToDevicePing = (
  callback: (event: { message: string; timestamp: number }) => void,
): (() => void) => {
  if (!eventEmitter) return () => {}
  const subscription = eventEmitter.addListener("onDeviceHelperPing", (event: any) =>
    callback(event),
  )
  return () => {
    subscription.remove()
  }
}
