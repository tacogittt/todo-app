enum NoiseType { brown, green }

class AppSettings {
  final int timerMinutes;
  final NoiseType noiseType;
  final int fadeDurationMinutes;
  final bool breathingAnimationEnabled;
  final bool endingAnimationEnabled;
  final bool immersiveModeEnabled;

  const AppSettings({
    this.timerMinutes = 10,
    this.noiseType = NoiseType.brown,
    this.fadeDurationMinutes = 1,
    this.breathingAnimationEnabled = true,
    this.endingAnimationEnabled = true,
    this.immersiveModeEnabled = true,
  });

  AppSettings copyWith({
    int? timerMinutes,
    NoiseType? noiseType,
    int? fadeDurationMinutes,
    bool? breathingAnimationEnabled,
    bool? endingAnimationEnabled,
    bool? immersiveModeEnabled,
  }) {
    return AppSettings(
      timerMinutes: timerMinutes ?? this.timerMinutes,
      noiseType: noiseType ?? this.noiseType,
      fadeDurationMinutes: fadeDurationMinutes ?? this.fadeDurationMinutes,
      breathingAnimationEnabled:
          breathingAnimationEnabled ?? this.breathingAnimationEnabled,
      endingAnimationEnabled:
          endingAnimationEnabled ?? this.endingAnimationEnabled,
      immersiveModeEnabled: immersiveModeEnabled ?? this.immersiveModeEnabled,
    );
  }
}
