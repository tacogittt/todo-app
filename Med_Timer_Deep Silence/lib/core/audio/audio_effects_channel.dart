import 'package:flutter/services.dart';

class AudioEffectsChannel {
  static const _channel = MethodChannel(
    'com.example.deep_silence/audio_effects',
  );

  Future<void> setLowPassFilter({
    required double cutoffHz,
    required double gainDb,
  }) async {
    await _channel.invokeMethod('setLowPassFilter', {
      'cutoffHz': cutoffHz,
      'gainDb': gainDb,
    });
  }

  Future<void> removeLowPassFilter() async =>
      _channel.invokeMethod('removeLowPassFilter');
}
