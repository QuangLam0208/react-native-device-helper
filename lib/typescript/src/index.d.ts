export { multiply } from './multiply';
export interface HardwareInfo {
    totalRamMb: number;
    availRamMb: number;
    batteryLevel: number;
    isCharging: boolean;
    manufacturer: string;
    model: string;
    androidVersion: string;
}
export interface DeviceConstants {
    ANDROID_VERSION: string;
    SDK_INT: number;
    MANUFACTURER: string;
    MODEL: string;
}
export declare const getDeviceConstants: () => DeviceConstants | null;
export declare const getHardwareInfo: () => Promise<HardwareInfo>;
export declare const showToast: (message: string, isLong?: boolean) => void;
export declare const triggerNativePing: (note: string) => void;
export declare const subscribeToDevicePing: (callback: (event: {
    message: string;
    timestamp: number;
}) => void) => (() => void);
//# sourceMappingURL=index.d.ts.map