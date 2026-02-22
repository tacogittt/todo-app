import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/core/timer/timer_service.dart';

void main() {
  group('TimerService', () {
    test('初期状態はidleで残り時間は設定値と同じ', () {
      final service = TimerService(durationMinutes: 10);
      expect(service.state, equals(TimerState.idle));
      expect(service.remaining, equals(const Duration(minutes: 10)));
    });

    test('isFading: 残り時間がフェード時間以下でtrueを返す', () {
      final service = TimerService(durationMinutes: 10, fadeDurationMinutes: 2);
      service.setRemainingForTest(const Duration(minutes: 1, seconds: 30));
      expect(service.isFading, isTrue);
    });

    test('isFading: 残り時間がフェード時間より多い場合はfalseを返す', () {
      final service = TimerService(durationMinutes: 10, fadeDurationMinutes: 2);
      service.setRemainingForTest(const Duration(minutes: 5));
      expect(service.isFading, isFalse);
    });

    test('fadeProgress: フェード進行度を0.0〜1.0で返す', () {
      final service = TimerService(durationMinutes: 10, fadeDurationMinutes: 2);
      // 残り1分 = フェード2分の半分経過 → 0.5
      service.setRemainingForTest(const Duration(minutes: 1));
      expect(service.fadeProgress, closeTo(0.5, 0.01));
    });

    test('fadeProgress: フェード中でない場合は0.0を返す', () {
      final service = TimerService(durationMinutes: 10, fadeDurationMinutes: 2);
      service.setRemainingForTest(const Duration(minutes: 5));
      expect(service.fadeProgress, equals(0.0));
    });
  });
}
