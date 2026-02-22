import 'package:flutter/foundation.dart';
import 'package:deep_silence/core/audio/audio_service.dart';
import 'package:deep_silence/core/timer/timer_service.dart';
import 'package:deep_silence/core/settings/app_settings.dart';

class SessionViewModel extends ChangeNotifier {
  final AudioService audioService;
  final AppSettings settings;
  late final TimerService _timer;

  bool _isPlaying = false;

  bool get isPlaying => _isPlaying;
  Duration get remaining => _timer.remaining;
  double get fadeProgress => _timer.fadeProgress;
  bool get isFading => _timer.isFading;
  TimerState get timerState => _timer.state;

  SessionViewModel({
    required this.audioService,
    required this.settings,
  }) {
    _timer = TimerService(
      durationMinutes: settings.timerMinutes,
      fadeDurationMinutes: settings.fadeDurationMinutes,
    );
    _timer.addListener(_onTimerTick);
  }

  Future<void> startSession() async {
    await audioService.loadAndLoop(settings.noiseType);
    await audioService.play();
    _timer.start();
    _isPlaying = true;
    notifyListeners();
  }

  Future<void> stopSession() async {
    _timer.stop();
    await audioService.stop();
    _isPlaying = false;
    notifyListeners();
  }

  void _onTimerTick() {
    if (_timer.isFading) {
      final volume = audioService.clampVolume(1.0 - _timer.fadeProgress);
      audioService.setVolume(volume);
    }
    if (_timer.state == TimerState.completed) {
      audioService.stop();
      _isPlaying = false;
    }
    notifyListeners();
  }

  @override
  void dispose() {
    _timer.removeListener(_onTimerTick);
    _timer.dispose();
    audioService.dispose();
    super.dispose();
  }
}
