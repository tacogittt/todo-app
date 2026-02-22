import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:deep_silence/core/audio/audio_service.dart';
import 'package:deep_silence/core/settings/app_settings.dart';
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
  });
}
