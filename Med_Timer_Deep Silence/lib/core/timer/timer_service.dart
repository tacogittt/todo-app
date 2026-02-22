import 'dart:async';
import 'package:flutter/foundation.dart';

enum TimerState { idle, playing, fading, completed }

class TimerService extends ChangeNotifier {
  final int durationMinutes;
  final int fadeDurationMinutes;

  TimerState _state = TimerState.idle;
  Duration _remaining;
  Timer? _timer;

  TimerService({
    required this.durationMinutes,
    this.fadeDurationMinutes = 1,
  }) : _remaining = Duration(minutes: durationMinutes);

  TimerState get state => _state;
  Duration get remaining => _remaining;

  bool get isFading =>
      _remaining <= Duration(minutes: fadeDurationMinutes) &&
      _remaining > Duration.zero;

  /// フェード進行度 0.0（フェード開始）→ 1.0（完了直前）
  double get fadeProgress {
    if (!isFading) return 0.0;
    final fadeTotal = Duration(minutes: fadeDurationMinutes);
    final elapsed = fadeTotal - _remaining;
    return elapsed.inMilliseconds / fadeTotal.inMilliseconds;
  }

  void start() {
    if (_state != TimerState.idle) return;
    _state = TimerState.playing;
    _timer = Timer.periodic(const Duration(seconds: 1), _tick);
    notifyListeners();
  }

  void stop() {
    _timer?.cancel();
    _state = TimerState.idle;
    _remaining = Duration(minutes: durationMinutes);
    notifyListeners();
  }

  void _tick(Timer _) {
    if (_remaining <= Duration.zero) {
      _timer?.cancel();
      _state = TimerState.completed;
      notifyListeners();
      return;
    }
    _remaining -= const Duration(seconds: 1);
    if (isFading && _state == TimerState.playing) {
      _state = TimerState.fading;
    }
    notifyListeners();
  }

  @visibleForTesting
  void setRemainingForTest(Duration duration) {
    _remaining = duration;
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
