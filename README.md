# native-module

Bộ native module cho ứng dụng React Native.

Mỗi module là một thư mục độc lập trong repo này và được cài riêng. Ứng dụng chỉ cần cài module mình dùng.

## Danh sách module

| Module | Chức năng | Nền tảng | Tài liệu |
| :--- | :--- | :--- | :--- |
| `native-device-helper` | Thông tin thiết bị, RAM, Pin, Toast, Native Ping Event | Android (iOS đang chuẩn bị) | [README](native-device-helper/README.md) |

## Cấu trúc repository

```text
native-module/
├── .gitattributes
├── .gitignore
├── README.md
└── native-device-helper/
    ├── expo-module.config.json   Khai báo module cho Expo Autolinking (iOS)
    ├── react-native.config.js    Khai báo module cho React Native CLI Autolinking (Android)
    ├── package.json              Cấu hình package (main trỏ trực tiếp vào index.ts)
    ├── index.ts                  Mã nguồn TypeScript
    ├── README.md                 Tài liệu riêng của module
    ├── ios/                      Mã nguồn iOS
    └── android/                  Mã nguồn Android (Java + React Native Bridge)
        ├── build.gradle
        └── src/main/
            ├── AndroidManifest.xml
            └── java/com/devicehelper/
                ├── DeviceHelperModule.java
                └── DeviceHelperPackage.java
```

## Cài đặt

Cài đặt module qua Git bằng `path:`:

```bash
pnpm add "github:QuangLam0208/native-module#path:/native-device-helper"
```

Sau khi cài đặt, sinh lại thư mục native và build:

```bash
npx expo prebuild --clean
npx expo run:android
```
