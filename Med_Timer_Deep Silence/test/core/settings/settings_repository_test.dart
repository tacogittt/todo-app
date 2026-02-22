import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:deep_silence/core/settings/app_settings.dart';
import 'package:deep_silence/core/settings/settings_repository.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('SettingsRepository', () {
    late SettingsRepository repository;

    setUp(() async {
      SharedPreferences.setMockInitialValues({});
      repository = SettingsRepository();
      await repository.init();
    });

    test('デフォルト設定が正しく返る', () {
      final s = repository.settings;
      expect(s.timerMinutes, equals(10));
      expect(s.noiseType, equals(NoiseType.brown));
      expect(s.fadeDurationMinutes, equals(1));
      expect(s.breathingAnimationEnabled, isTrue);
      expect(s.endingAnimationEnabled, isTrue);
      expect(s.immersiveModeEnabled, isTrue);
    });

    test('設定を保存して読み込める', () async {
      const updated = AppSettings(
        timerMinutes: 25,
        noiseType: NoiseType.green,
        fadeDurationMinutes: 3,
        breathingAnimationEnabled: false,
        endingAnimationEnabled: true,
        immersiveModeEnabled: false,
      );
      await repository.save(updated);
      expect(repository.settings.timerMinutes, equals(25));
      expect(repository.settings.noiseType, equals(NoiseType.green));
      expect(repository.settings.fadeDurationMinutes, equals(3));
      expect(repository.settings.breathingAnimationEnabled, isFalse);
      expect(repository.settings.immersiveModeEnabled, isFalse);
    });
  });
}
