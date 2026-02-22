import 'dart:math';
import 'package:just_audio/just_audio.dart';
import 'package:deep_silence/core/settings/app_settings.dart';

class AudioService {
  final AudioPlayer _player = AudioPlayer();

  Future<void> loadAndLoop(NoiseType noiseType) async {
    final path = noiseType == NoiseType.brown
        ? 'assets/audio/brown_noise.wav'
        : 'assets/audio/green_noise.wav';
    await _player.setAsset(path);
    await _player.setLoopMode(LoopMode.one);
  }

  Future<void> play() async => _player.play();

  Future<void> stop() async {
    await _player.stop();
    await _player.seek(Duration.zero);
  }

  Future<void> setVolume(double volume) async =>
      _player.setVolume(clampVolume(volume));

  Future<void> dispose() async => _player.dispose();

  double clampVolume(double volume) => volume.clamp(0.0, 1.0);

  /// フェード進行度（0.0〜1.0）からLPFカットオフ周波数（Hz）を対数スケールで計算する
  /// 0.0 → 20000Hz, 1.0 → 200Hz
  double calculateCutoff(double progress) {
    const maxHz = 20000.0;
    const minHz = 200.0;
    return exp(log(maxHz) + (log(minHz) - log(maxHz)) * progress);
  }
}
