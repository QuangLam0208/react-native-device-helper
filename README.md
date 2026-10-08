# react-native-device-helper

Native module đọc thông tin thiết bị và phần cứng cho Android & iOS:
- **Android:** Viết bằng Java với React Native Bridge (`ReactContextBaseJavaModule`).
- **iOS:** Thiết kế cho Expo Modules API (đang chuẩn bị triển khai).

Module cung cấp thông tin hệ điều hành, model thiết bị, dung lượng RAM, trạng thái pin, hiển thị Toast native, và phát sự kiện native ping lên JavaScript.

## Thông tin chung

| Hạng mục | Giá trị |
| :--- | :--- |
| Nền tảng | Android SDK 24 trở lên (iOS đang hoàn thiện) |
| Ngôn ngữ | Java (Android) |
| Framework | React Native Bridge (`ReactContextBaseJavaModule`) |
| Đã kiểm thử với | Expo SDK 57, React Native 0.86 |
| Môi trường chạy | Development build hoặc bản release. Expo Go không hỗ trợ. |

## Cấu trúc module

```text
react-native-device-helper/
├── expo-module.config.json       Khai báo module cho Expo Autolinking (iOS)
├── react-native.config.js        Khai báo module cho React Native CLI Autolinking (Android)
├── package.json
├── index.ts                      API TypeScript dùng chung
├── README.md
├── ios/
└── android/
    ├── build.gradle              Cấu hình thư viện Android
    └── src/main/
        ├── AndroidManifest.xml
        └── java/com/devicehelper/
            ├── DeviceHelperModule.java    Logic native Android
            └── DeviceHelperPackage.java   ReactPackage cho Autolinking
```

## Cài đặt

Cài đặt package vào ứng dụng:

```bash
pnpm add "github:QuangLam0208/react-native-device-helper"
```

Sau khi cài đặt, sinh lại thư mục native và build app:

```bash
npx expo prebuild --clean
npx expo run:android
```

## Cách sử dụng

```tsx
import { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import {
  getDeviceConstants,
  getHardwareInfo,
  showToast,
  subscribeToDevicePing,
  triggerNativePing,
  type HardwareInfo,
} from "react-native-device-helper"

export function DeviceCard() {
  const [hardware, setHardware] = useState<HardwareInfo | null>(null)
  const [lastEvent, setLastEvent] = useState<string>("")
  const constants = getDeviceConstants()

  useEffect(() => {
    // 1. Đọc thông tin phần cứng qua Promise
    getHardwareInfo().then(setHardware)

    // 2. Đăng ký lắng nghe sự kiện từ Native
    const unsubscribe = subscribeToDevicePing((event) => {
      setLastEvent(`${event.message} lúc ${new Date(event.timestamp).toLocaleTimeString()}`)
    })

    return () => unsubscribe()
  }, [])

  return (
    <View>
      <Text>Hệ điều hành: {constants?.ANDROID_VERSION}</Text>
      <Text>Thiết bị: {constants?.MODEL}</Text>
      {hardware && (
        <Text>RAM: {hardware.availRamMb} MB / {hardware.totalRamMb} MB</Text>
      )}
      <Button title="Hiện Toast" onPress={() => showToast("Xin chào từ Native!", true)} />
      <Button title="Bắn Native Ping" onPress={() => triggerNativePing("Test")} />
      {lastEvent ? <Text>Sự kiện: {lastEvent}</Text> : null}
    </View>
  )
}
```

## Bảng API

| Hàm / Thuộc tính | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `getDeviceConstants()` | `DeviceConstants \| null` | Đọc đồng bộ: OS version, SDK, Model, Manufacturer |
| `getHardwareInfo()` | `Promise<HardwareInfo>` | Đọc RAM, Mức pin, Trạng thái sạc |
| `showToast(message, isLong)` | `void` | Hiển thị thông báo Toast native trên Android |
| `triggerNativePing(note)` | `void` | Kích hoạt native phát sự kiện `onDeviceHelperPing` |
| `subscribeToDevicePing(callback)` | `() => void` | Đăng ký nhận sự kiện từ Native, trả về hàm hủy đăng ký |
