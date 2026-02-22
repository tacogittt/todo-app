import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/core/audio/audio_effects_channel.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('AudioEffectsChannel', () {
    late AudioEffectsChannel channel;

    setUp(() {
      channel = AudioEffectsChannel();
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(
        const MethodChannel('com.example.deep_silence/audio_effects'),
        (call) async => null,
      );
    });

    test('setLowPassFilterがエラーなく呼べる', () {
      expect(
        () => channel.setLowPassFilter(cutoffHz: 5000, gainDb: 0.5),
        returnsNormally,
      );
    });

    test('removeLowPassFilterがエラーなく呼べる', () {
      expect(() => channel.removeLowPassFilter(), returnsNormally);
    });
  });
}
