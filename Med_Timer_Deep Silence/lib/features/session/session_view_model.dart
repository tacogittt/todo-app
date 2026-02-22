import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:deep_silence/core/audio/audio_service.dart';
import 'package:deep_silence/core/timer/timer_service.dart';
import 'package:deep_silence/core/settings/app_settings.dart';

class SessionViewModel extends ChangeNotifier {
  final AudioService audioService;
  final AppSettings settings;
  late final TimerService _timer;

  bool _isPlaying = false;
  StreamSubscription<void>? _unexpectedStopSubscription;

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
    // タイマーを即時開始（音声読み込みより先に）
    // setAsset() がオーディオセッション確立まで返らない場合があるため
    _timer.start();
    _isPlaying = true;
    notifyListeners();
    await audioService.loadAndLoop(settings.noiseType);
    await audioService.play();
    // play() 呼び出し後にストリームを購読（初期状態は playing=true のため誤検知しない）
    _unexpectedStopSubscription =
        audioService.unexpectedStopStream.listen((_) {
      _handleAudioInterruption();
    });
  }

  Future<void> stopSession() async {
    // 購読を先にキャンセルしてから stop() を呼ぶことで
    // 意図的な停止が _handleAudioInterruption を起動しないようにする
    _unexpectedStopSubscription?.cancel();
    _unexpectedStopSubscription = null;
    _isPlaying = false;
    _timer.stop();
    await audioService.stop();
    notifyListeners();
  }

  void _handleAudioInterruption() {
    _unexpectedStopSubscription?.cancel();
    _unexpectedStopSubscription = null;
    _isPlaying = false;
    _timer.stop();
    notifyListeners();
  }

  void _onTimerTick() {
    if (_timer.isFading) {
      final volume = audioService.clampVolume(1.0 - _timer.fadeProgress);
      audioService.setVolume(volume);
    }
    if (_timer.state == TimerState.completed) {
      // 購読を先にキャンセルしてから stop() を呼ぶ
      _unexpectedStopSubscription?.cancel();
      _unexpectedStopSubscription = null;
      _isPlaying = false;
      audioService.stop();
    }
    notifyListeners();
  }

  @override
  void dispose() {
    _unexpectedStopSubscription?.cancel();
    _timer.removeListener(_onTimerTick);
    _timer.dispose();
    audioService.dispose();
    super.dispose();
  }
}
