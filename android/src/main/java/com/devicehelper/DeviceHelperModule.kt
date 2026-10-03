package com.devicehelper

import com.facebook.react.bridge.ReactApplicationContext

class DeviceHelperModule(reactContext: ReactApplicationContext) :
  NativeDeviceHelperSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeDeviceHelperSpec.NAME
  }
}
