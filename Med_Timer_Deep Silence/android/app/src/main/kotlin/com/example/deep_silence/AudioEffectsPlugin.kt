package com.example.deep_silence

import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.BinaryMessenger

class AudioEffectsPlugin(messenger: BinaryMessenger) : MethodChannel.MethodCallHandler {
    companion object {
        const val CHANNEL = "com.example.deep_silence/audio_effects"
    }

    init {
        MethodChannel(messenger, CHANNEL).setMethodCallHandler(this)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "setLowPassFilter" -> result.success(null)
            "removeLowPassFilter" -> result.success(null)
            else -> result.notImplemented()
        }
    }
}
