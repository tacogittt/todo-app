import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/core/audio/audio_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('AudioService', () {
    test('インスタンスが生成できる', () {
      final service = AudioService();
      expect(service, isNotNull);
    });

    test('clampVolume: 音量を0.0〜1.0の範囲に制限する', () {
      final service = AudioService();
      expect(service.clampVolume(1.5), equals(1.0));
      expect(service.clampVolume(-0.1), equals(0.0));
      expect(service.clampVolume(0.5), equals(0.5));
    });

    test('calculateCutoff: フェード進行度からLPFカットオフ周波数を計算する', () {
      final service = AudioService();
      expect(service.calculateCutoff(0.0), closeTo(20000, 1));
      expect(service.calculateCutoff(1.0), closeTo(200, 1));
      expect(service.calculateCutoff(0.5), greaterThan(200));
      expect(service.calculateCutoff(0.5), lessThan(20000));
    });
  });
}
