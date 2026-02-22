import 'package:shared_preferences/shared_preferences.dart';
import 'app_settings.dart';

class SettingsRepository {
  static const _keyTimerMinutes = 'timer_minutes';
  static const _keyNoiseType = 'noise_type';
  static const _keyFadeDuration = 'fade_duration_minutes';
  static const _keyBreathingAnimation = 'breathing_animation';
  static const _keyEndingAnimation = 'ending_animation';
  static const _keyImmersiveMode = 'immersive_mode';

  late SharedPreferences _prefs;
  AppSettings _settings = const AppSettings();

  AppSettings get settings => _settings;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    _settings = AppSettings(
      timerMinutes: _prefs.getInt(_keyTimerMinutes) ?? 10,
      noiseType: NoiseType.values[_prefs.getInt(_keyNoiseType) ?? 0],
      fadeDurationMinutes: _prefs.getInt(_keyFadeDuration) ?? 1,
      breathingAnimationEnabled:
          _prefs.getBool(_keyBreathingAnimation) ?? true,
      endingAnimationEnabled: _prefs.getBool(_keyEndingAnimation) ?? true,
      immersiveModeEnabled: _prefs.getBool(_keyImmersiveMode) ?? true,
    );
  }

  Future<void> save(AppSettings settings) async {
    _settings = settings;
    await _prefs.setInt(_keyTimerMinutes, settings.timerMinutes);
    await _prefs.setInt(_keyNoiseType, settings.noiseType.index);
    await _prefs.setInt(_keyFadeDuration, settings.fadeDurationMinutes);
    await _prefs.setBool(
        _keyBreathingAnimation, settings.breathingAnimationEnabled);
    await _prefs.setBool(
        _keyEndingAnimation, settings.endingAnimationEnabled);
    await _prefs.setBool(_keyImmersiveMode, settings.immersiveModeEnabled);
  }
}
