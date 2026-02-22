import 'dart:async';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:deep_silence/core/audio/audio_service.dart';
import 'package:deep_silence/core/settings/app_settings.dart';
import 'package:deep_silence/core/timer/timer_service.dart';
import 'package:deep_silence/features/session/session_view_model.dart';

class MockAudioService extends Mock implements AudioService {}

void main() {
  setUpAll(() {
    registerFallbackValue(NoiseType.brown);
  });

  group('SessionViewModel', () {
    late SessionViewModel viewModel;
    late MockAudioService mockAudio;

    setUp(() {
      mockAudio = MockAudioService();
      when(() => mockAudio.loadAndLoop(any())).thenAnswer((_) async {});
      when(() => mockAudio.play()).thenAnswer((_) async {});
      when(() => mockAudio.stop()).thenAnswer((_) async {});
      when(() => mockAudio.setVolume(any())).thenAnswer((_) async {});
      when(() => mockAudio.dispose()).thenAnswer((_) async {});
      when(() => mockAudio.clampVolume(any())).thenAnswer(
        (inv) => (inv.positionalArguments[0] as double).clamp(0.0, 1.0),
      );
      // 通常テストでは予期せぬ停止は発生しない
      when(() => mockAudio.unexpectedStopStream)
          .thenAnswer((_) => const Stream.empty());
      viewModel = SessionViewModel(
        audioService: mockAudio,
        settings: const AppSettings(timerMinutes: 5, fadeDurationMinutes: 1),
      );
    });

    tearDown(() => viewModel.dispose());

    test('初期状態はisPlayingがfalse', () {
      expect(viewModel.isPlaying, isFalse);
    });

    test('startSession後はisPlayingがtrueになる', () async {
      await viewModel.startSession();
      expect(viewModel.isPlaying, isTrue);
      verify(() => mockAudio.loadAndLoop(NoiseType.brown)).called(1);
      verify(() => mockAudio.play()).called(1);
    });

    test('stopSession後はisPlayingがfalseに戻る', () async {
      await viewModel.startSession();
      await viewModel.stopSession();
      expect(viewModel.isPlaying, isFalse);
      verify(() => mockAudio.stop()).called(1);
    });

    test('予期せぬ音声停止（ヘッドホン切断等）でセッションが停止する', () async {
      // unexpectedStopStream を手動制御できる StreamController を用意
      final stopController = StreamController<void>();
      when(() => mockAudio.unexpectedStopStream)
          .thenAnswer((_) => stopController.stream);

      await viewModel.startSession();
      expect(viewModel.isPlaying, isTrue);
      expect(viewModel.timerState, equals(TimerState.playing));

      // ヘッドホン切断をシミュレート
      stopController.add(null);
      await Future.delayed(Duration.zero);

      expect(viewModel.isPlaying, isFalse);
      expect(viewModel.timerState, equals(TimerState.idle));

      await stopController.close();
    });

    test('startSession は loadAndLoop完了前にタイマーを開始する', () async {
      // loadAndLoop を永遠にブロックするCompleterを用意
      final completer = Completer<void>();
      when(() => mockAudio.loadAndLoop(any())).thenAnswer((_) => completer.future);

      // await しない — loadAndLoop がブロックしたままでもタイマーが起動するか確認
      // ignore: unawaited_futures
      viewModel.startSession();

      // loadAndLoop完了前の時点でタイマーとisPlayingが起動済みであること
      expect(viewModel.timerState, equals(TimerState.playing));
      expect(viewModel.isPlaying, isTrue);

      // クリーンアップ
      completer.complete();
      await Future.delayed(Duration.zero);
    });
  });
}
