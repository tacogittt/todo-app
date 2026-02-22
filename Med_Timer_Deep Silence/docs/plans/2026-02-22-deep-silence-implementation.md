# Deep Silence 実装計画書

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** ブラウンノイズ/グリーンノイズに特化したミニマリスト瞑想タイマーFlutterアプリを実装する

**Architecture:** MVVM + Repositoryパターン。Dart層でjust_audioによる音声再生とProviderによる状態管理を行い、終了時のLPFエフェクトのみPlatform Channel経由でネイティブ処理する（MVPではDart側音量フェードを優先）。

**Tech Stack:** Flutter (Dart), just_audio, audio_session, provider, shared_preferences, wakelock_plus, mocktail

---

## 事前準備：音源ファイルの用意

**重要:** 実装開始前に以下の音源ファイルを用意すること。

- `assets/audio/brown_noise.wav` — ブラウンノイズ（WAV, 44.1kHz, ステレオ, 30秒以上）
- `assets/audio/green_noise.wav` — グリーンノイズ（同形式）

**音源入手方法:**
1. Freesound.org で "brown noise seamless loop" / "green noise seamless loop" を検索
2. またはAudacityで生成: Generate → Noise → Brown/Pink
3. ループ編集: Effect → Fade In/Out で先頭・末尾をゼロクロッシングに合わせる

音源ファイルはリポジトリに含めないこと。`.gitignore` に以下を追加する:
```
assets/audio/*.wav
assets/audio/*.mp3
```

---

## Task 1: Flutterプロジェクト初期化

**Files:**
- Modify: `pubspec.yaml`
- Create: `assets/audio/` ディレクトリ

**Step 1: Flutterプロジェクトを作成する**

```bash
flutter create --org com.example --project-name deep_silence .
```

Expected: `All done!`

**Step 2: pubspec.yamlのdependenciesを以下に置き換える**

```yaml
dependencies:
  flutter:
    sdk: flutter
  just_audio: ^0.9.40
  audio_session: ^0.1.21
  provider: ^6.1.2
  shared_preferences: ^2.3.2
  wakelock_plus: ^1.2.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  mocktail: ^1.0.4
```

`pubspec.yaml` の `flutter:` セクションにアセット宣言を追加する:

```yaml
flutter:
  assets:
    - assets/audio/brown_noise.wav
    - assets/audio/green_noise.wav
```

**Step 3: 音源ファイルを配置してパッケージをインストールする**

```bash
mkdir -p assets/audio
# brown_noise.wav と green_noise.wav を assets/audio/ にコピーする
flutter pub get
```

Expected: `Got dependencies!`

**Step 4: ディレクトリ構造を作成する**

```bash
mkdir -p lib/core/audio lib/core/timer lib/core/settings
mkdir -p lib/features/home lib/features/session lib/features/settings
mkdir -p lib/shared/widgets
mkdir -p test/core/audio test/core/timer test/core/settings
mkdir -p test/features/home test/features/session test/features/settings
mkdir -p test/shared/widgets
```

**Step 5: コミットする**

```bash
git add pubspec.yaml pubspec.lock
git commit -m "chore: Flutterプロジェクト初期化・パッケージ設定"
```

---

## Task 2: AppSettingsモデルとSettingsRepository

**Files:**
- Create: `lib/core/settings/app_settings.dart`
- Create: `lib/core/settings/settings_repository.dart`
- Create: `test/core/settings/settings_repository_test.dart`

**Step 1: テストを書く**

`test/core/settings/settings_repository_test.dart`:

```dart
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
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/core/settings/settings_repository_test.dart
```

Expected: FAIL（ファイルが存在しないため）

**Step 3: AppSettingsを実装する**

`lib/core/settings/app_settings.dart`:

```dart
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
```

**Step 4: SettingsRepositoryを実装する**

`lib/core/settings/settings_repository.dart`:

```dart
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
```

**Step 5: テストが通ることを確認する**

```bash
flutter test test/core/settings/settings_repository_test.dart
```

Expected: All tests PASS

**Step 6: コミットする**

```bash
git add lib/core/settings/ test/core/settings/
git commit -m "feat: AppSettingsモデルとSettingsRepositoryを追加"
```

---

## Task 3: TimerService（タイマーロジック）

**Files:**
- Create: `lib/core/timer/timer_service.dart`
- Create: `test/core/timer/timer_service_test.dart`

**Step 1: テストを書く**

`test/core/timer/timer_service_test.dart`:

```dart
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
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/core/timer/timer_service_test.dart
```

Expected: FAIL

**Step 3: TimerServiceを実装する**

`lib/core/timer/timer_service.dart`:

```dart
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
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/core/timer/timer_service_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/core/timer/ test/core/timer/
git commit -m "feat: TimerServiceを追加（カウントダウン・フェード検知）"
```

---

## Task 4: AudioService（just_audio音声再生）

**Files:**
- Create: `lib/core/audio/audio_service.dart`
- Create: `test/core/audio/audio_service_test.dart`

**Step 1: テストを書く**

`test/core/audio/audio_service_test.dart`:

```dart
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
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/core/audio/audio_service_test.dart
```

Expected: FAIL

**Step 3: AudioServiceを実装する**

`lib/core/audio/audio_service.dart`:

```dart
import 'dart:math';
import 'package:just_audio/just_audio.dart';
import 'package:deep_silence/core/settings/app_settings.dart';

class AudioService {
  final AudioPlayer _player = AudioPlayer();

  Future<void> loadAndLoop(NoiseType noiseType) async {
    final path = noiseType == NoiseType.brown
        ? 'assets/audio/brown_noise.wav'
        : 'assets/audio/green_noise.wav';
    await _player.setAsset(path);
    await _player.setLoopMode(LoopMode.one);
  }

  Future<void> play() async => _player.play();

  Future<void> stop() async {
    await _player.stop();
    await _player.seek(Duration.zero);
  }

  Future<void> setVolume(double volume) async =>
      _player.setVolume(clampVolume(volume));

  Future<void> dispose() async => _player.dispose();

  double clampVolume(double volume) => volume.clamp(0.0, 1.0);

  /// フェード進行度（0.0〜1.0）からLPFカットオフ周波数（Hz）を対数スケールで計算する
  /// 0.0 → 20000Hz, 1.0 → 200Hz
  double calculateCutoff(double progress) {
    const maxHz = 20000.0;
    const minHz = 200.0;
    return exp(log(maxHz) + (log(minHz) - log(maxHz)) * progress);
  }
}
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/core/audio/audio_service_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/core/audio/ test/core/audio/
git commit -m "feat: AudioServiceを追加（just_audio再生・LPF計算）"
```

---

## Task 5: AudioEffectsChannel（LPF Platform Channelブリッジ）

**Files:**
- Create: `lib/core/audio/audio_effects_channel.dart`
- Create: `test/core/audio/audio_effects_channel_test.dart`

**Step 1: テストを書く**

`test/core/audio/audio_effects_channel_test.dart`:

```dart
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/core/audio/audio_effects_channel.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('AudioEffectsChannel', () {
    late AudioEffectsChannel channel;

    setUp(() {
      channel = AudioEffectsChannel();
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(
        const MethodChannel('com.example.deep_silence/audio_effects'),
        (call) async => null,
      );
    });

    test('setLowPassFilterがエラーなく呼べる', () {
      expect(
        () => channel.setLowPassFilter(cutoffHz: 5000, gainDb: 0.5),
        returnsNormally,
      );
    });

    test('removeLowPassFilterがエラーなく呼べる', () {
      expect(() => channel.removeLowPassFilter(), returnsNormally);
    });
  });
}
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/core/audio/audio_effects_channel_test.dart
```

Expected: FAIL

**Step 3: AudioEffectsChannelを実装する**

`lib/core/audio/audio_effects_channel.dart`:

```dart
import 'package:flutter/services.dart';

class AudioEffectsChannel {
  static const _channel = MethodChannel(
    'com.example.deep_silence/audio_effects',
  );

  Future<void> setLowPassFilter({
    required double cutoffHz,
    required double gainDb,
  }) async {
    await _channel.invokeMethod('setLowPassFilter', {
      'cutoffHz': cutoffHz,
      'gainDb': gainDb,
    });
  }

  Future<void> removeLowPassFilter() async =>
      _channel.invokeMethod('removeLowPassFilter');
}
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/core/audio/audio_effects_channel_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/core/audio/audio_effects_channel.dart test/core/audio/audio_effects_channel_test.dart
git commit -m "feat: AudioEffectsChannel（LPF Platform Channelブリッジ）を追加"
```

---

## Task 6: iOS LPF Platform Channelネイティブ実装

**Files:**
- Create: `ios/Runner/AudioEffectsPlugin.swift`
- Modify: `ios/Runner/AppDelegate.swift`
- Modify: `ios/Runner/Info.plist`

**Step 1: iOSプラグインを実装する**

`ios/Runner/AudioEffectsPlugin.swift`:

```swift
import Flutter
import AVFoundation

class AudioEffectsPlugin: NSObject, FlutterPlugin {
    static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(
            name: "com.example.deep_silence/audio_effects",
            binaryMessenger: registrar.messenger()
        )
        registrar.addMethodCallDelegate(AudioEffectsPlugin(), channel: channel)
    }

    func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "setLowPassFilter":
            // MVP: Dart側の音量フェードで代替。
            // 将来はAVAudioEngineノードグラフでAVAudioUnitEQを接続する。
            result(nil)
        case "removeLowPassFilter":
            result(nil)
        default:
            result(FlutterMethodNotImplemented)
        }
    }
}
```

**Step 2: AppDelegate.swiftにプラグイン登録を追加する**

`ios/Runner/AppDelegate.swift` の `return super.application(...)` の直前に追加:

```swift
AudioEffectsPlugin.register(with: self.registrar(forPlugin: "AudioEffectsPlugin")!)
```

**Step 3: Info.plistにバックグラウンド音声モードを追加する**

`ios/Runner/Info.plist` の `</dict>` 直前に追加:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

**Step 4: iOSビルドが通ることを確認する**

```bash
flutter build ios --no-codesign
```

Expected: `Build complete.`

**Step 5: コミットする**

```bash
git add ios/
git commit -m "feat: iOS LPF Platform Channelプラグインとバックグラウンド音声設定を追加"
```

---

## Task 7: Android LPF Platform Channelネイティブ実装

**Files:**
- Create: `android/app/src/main/kotlin/com/example/deep_silence/AudioEffectsPlugin.kt`
- Modify: `android/app/src/main/kotlin/com/example/deep_silence/MainActivity.kt`
- Modify: `android/app/src/main/AndroidManifest.xml`

**Step 1: Kotlinプラグインを実装する**

`android/app/src/main/kotlin/com/example/deep_silence/AudioEffectsPlugin.kt`:

```kotlin
package com.example.deep_silence

import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.BinaryMessenger

class AudioEffectsPlugin(messenger: BinaryMessenger) : MethodChannel.MethodCallHandler {
    companion object {
        const val CHANNEL = "com.example.deep_silence/audio_effects"
    }

    init {
        MethodChannel(messenger, CHANNEL).setMethodCallHandler(this)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "setLowPassFilter" -> result.success(null)
            "removeLowPassFilter" -> result.success(null)
            else -> result.notImplemented()
        }
    }
}
```

**Step 2: MainActivityにプラグイン登録を追加する**

`android/app/src/main/kotlin/com/example/deep_silence/MainActivity.kt`:

```kotlin
package com.example.deep_silence

import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        AudioEffectsPlugin(flutterEngine.dartExecutor.binaryMessenger)
    }
}
```

**Step 3: AndroidManifest.xmlにパーミッションを追加する**

`android/app/src/main/AndroidManifest.xml` の `<manifest>` 直下に追加:

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

**Step 4: Androidビルドが通ることを確認する**

```bash
flutter build apk --debug
```

Expected: `BUILD SUCCESSFUL`

**Step 5: コミットする**

```bash
git add android/
git commit -m "feat: Android LPF Platform Channelプラグインを追加"
```

---

## Task 8: SessionViewModel（MVVM状態管理）

**Files:**
- Create: `lib/features/session/session_view_model.dart`
- Create: `test/features/session/session_view_model_test.dart`

**Step 1: テストを書く**

`test/features/session/session_view_model_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:deep_silence/core/audio/audio_service.dart';
import 'package:deep_silence/core/settings/app_settings.dart';
import 'package:deep_silence/features/session/session_view_model.dart';

class MockAudioService extends Mock implements AudioService {}

void main() {
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
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/features/session/session_view_model_test.dart
```

Expected: FAIL

**Step 3: SessionViewModelを実装する**

`lib/features/session/session_view_model.dart`:

```dart
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
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/features/session/session_view_model_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/features/session/session_view_model.dart test/features/session/session_view_model_test.dart
git commit -m "feat: SessionViewModelを追加（タイマー・音声の状態管理）"
```

---

## Task 9: タイマーホイールWidget

**Files:**
- Create: `lib/shared/widgets/timer_wheel.dart`
- Create: `test/shared/widgets/timer_wheel_test.dart`

**Step 1: テストを書く**

`test/shared/widgets/timer_wheel_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/shared/widgets/timer_wheel.dart';

void main() {
  group('TimerWheel', () {
    testWidgets('指定した分数が中央に表示される', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TimerWheel(minutes: 15, onChanged: (_) {}),
          ),
        ),
      );
      expect(find.text('15'), findsOneWidget);
    });

    testWidgets('1と60の両端値でも表示される', (tester) async {
      for (final minutes in [1, 60]) {
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: TimerWheel(minutes: minutes, onChanged: (_) {}),
            ),
          ),
        );
        expect(find.text('$minutes'), findsOneWidget);
      }
    });
  });
}
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/shared/widgets/timer_wheel_test.dart
```

Expected: FAIL

**Step 3: TimerWheelを実装する**

`lib/shared/widgets/timer_wheel.dart`:

```dart
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class TimerWheel extends StatefulWidget {
  final int minutes;
  final ValueChanged<int> onChanged;

  const TimerWheel({super.key, required this.minutes, required this.onChanged});

  @override
  State<TimerWheel> createState() => _TimerWheelState();
}

class _TimerWheelState extends State<TimerWheel> {
  double _startAngle = 0;
  int _startMinutes = 0;

  void _onPanStart(DragStartDetails d) {
    _startAngle = _angle(d.localPosition);
    _startMinutes = widget.minutes;
  }

  void _onPanUpdate(DragUpdateDetails d) {
    var delta = _angle(d.localPosition) - _startAngle;
    if (delta > pi) delta -= 2 * pi;
    if (delta < -pi) delta += 2 * pi;
    final newMinutes =
        (_startMinutes + (delta / (2 * pi) * 60).round()).clamp(1, 60);
    if (newMinutes != widget.minutes) {
      HapticFeedback.selectionClick();
      widget.onChanged(newMinutes);
    }
  }

  double _angle(Offset pos) =>
      atan2(pos.dy - 100, pos.dx - 100); // Widget中心(100,100)

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanStart: _onPanStart,
      onPanUpdate: _onPanUpdate,
      child: CustomPaint(
        size: const Size(200, 200),
        painter: _WheelPainter(minutes: widget.minutes),
        child: SizedBox(
          width: 200,
          height: 200,
          child: Center(
            child: Text(
              '${widget.minutes}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 48,
                fontWeight: FontWeight.w200,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _WheelPainter extends CustomPainter {
  final int minutes;
  _WheelPainter({required this.minutes});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 10;

    canvas.drawCircle(center, radius,
        Paint()
          ..color = Colors.white.withValues(alpha: 0.1)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 4);

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      2 * pi * (minutes / 60),
      false,
      Paint()
        ..color = Colors.white.withValues(alpha: 0.7)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 4
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(_WheelPainter old) => old.minutes != minutes;
}
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/shared/widgets/timer_wheel_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/shared/widgets/timer_wheel.dart test/shared/widgets/
git commit -m "feat: 円形タイマーホイールWidgetを追加"
```

---

## Task 10: ホーム画面（HomeScreen）

**Files:**
- Create: `lib/features/home/home_screen.dart`
- Create: `test/features/home/home_screen_test.dart`

**Step 1: テストを書く**

`test/features/home/home_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/core/settings/app_settings.dart';
import 'package:deep_silence/features/home/home_screen.dart';

void main() {
  testWidgets('ホーム画面にBROWNとGREENが表示される', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: HomeScreen(
        settings: const AppSettings(),
        onSettingsChanged: (_) {},
        onStart: () {},
        onOpenSettings: () {},
      ),
    ));
    expect(find.text('BROWN'), findsOneWidget);
    expect(find.text('GREEN'), findsOneWidget);
  });

  testWidgets('開始ボタンが表示される', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: HomeScreen(
        settings: const AppSettings(),
        onSettingsChanged: (_) {},
        onStart: () {},
        onOpenSettings: () {},
      ),
    ));
    expect(find.text('開始'), findsOneWidget);
  });

  testWidgets('GREENをタップするとnoiseTypeが変わる', (tester) async {
    AppSettings current = const AppSettings();
    await tester.pumpWidget(MaterialApp(
      home: StatefulBuilder(
        builder: (_, setState) => HomeScreen(
          settings: current,
          onSettingsChanged: (s) => setState(() => current = s),
          onStart: () {},
          onOpenSettings: () {},
        ),
      ),
    ));
    await tester.tap(find.text('GREEN'));
    await tester.pump();
    expect(current.noiseType, equals(NoiseType.green));
  });
}
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/features/home/home_screen_test.dart
```

Expected: FAIL

**Step 3: HomeScreenを実装する**

`lib/features/home/home_screen.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:deep_silence/core/settings/app_settings.dart';
import 'package:deep_silence/shared/widgets/timer_wheel.dart';

class HomeScreen extends StatelessWidget {
  final AppSettings settings;
  final ValueChanged<AppSettings> onSettingsChanged;
  final VoidCallback onStart;
  final VoidCallback onOpenSettings;

  const HomeScreen({
    super.key,
    required this.settings,
    required this.onSettingsChanged,
    required this.onStart,
    required this.onOpenSettings,
  });

  Color get _bgColor => settings.noiseType == NoiseType.brown
      ? const Color(0xFF1A120B)
      : const Color(0xFF0A2647);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TimerWheel(
              minutes: settings.timerMinutes,
              onChanged: (v) =>
                  onSettingsChanged(settings.copyWith(timerMinutes: v)),
            ),
            const SizedBox(height: 8),
            Text('min',
                style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.4),
                    fontSize: 13)),
            const SizedBox(height: 40),
            _NoiseToggle(
              noiseType: settings.noiseType,
              onChanged: (v) =>
                  onSettingsChanged(settings.copyWith(noiseType: v)),
            ),
            const SizedBox(height: 48),
            GestureDetector(
              onTap: onStart,
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.12),
                  border: Border.all(
                      color: Colors.white.withValues(alpha: 0.35), width: 1),
                ),
                child: const Center(
                  child: Text('開始',
                      style: TextStyle(color: Colors.white, fontSize: 16)),
                ),
              ),
            ),
            const SizedBox(height: 32),
            IconButton(
              icon: Icon(Icons.settings,
                  color: Colors.white.withValues(alpha: 0.35), size: 20),
              onPressed: onOpenSettings,
            ),
          ],
        ),
      ),
    );
  }
}

class _NoiseToggle extends StatelessWidget {
  final NoiseType noiseType;
  final ValueChanged<NoiseType> onChanged;
  const _NoiseToggle({required this.noiseType, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _Label('BROWN', noiseType == NoiseType.brown,
            () => onChanged(NoiseType.brown)),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: () => onChanged(
              noiseType == NoiseType.brown ? NoiseType.green : NoiseType.brown),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: 44,
            height: 24,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: Colors.white.withValues(alpha: 0.15),
            ),
            child: AnimatedAlign(
              duration: const Duration(milliseconds: 300),
              alignment: noiseType == NoiseType.brown
                  ? Alignment.centerLeft
                  : Alignment.centerRight,
              child: Container(
                width: 20,
                height: 20,
                margin: const EdgeInsets.all(2),
                decoration: const BoxDecoration(
                    shape: BoxShape.circle, color: Colors.white),
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        _Label('GREEN', noiseType == NoiseType.green,
            () => onChanged(NoiseType.green)),
      ],
    );
  }
}

class _Label extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;
  const _Label(this.label, this.isActive, this.onTap);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Text(label,
          style: TextStyle(
            color: isActive
                ? Colors.white
                : Colors.white.withValues(alpha: 0.3),
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
          )),
    );
  }
}
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/features/home/home_screen_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/features/home/ test/features/home/
git commit -m "feat: ホーム画面（タイマーホイール・音源トグル）を追加"
```

---

## Task 11: 没入モード画面（SessionScreen）

**Files:**
- Create: `lib/features/session/session_screen.dart`
- Create: `test/features/session/session_screen_test.dart`

**Step 1: テストを書く**

`test/features/session/session_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/features/session/session_screen.dart';

void main() {
  group('SessionScreen', () {
    testWidgets('残り時間が正しくフォーマットされて表示される', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: SessionScreen(
          remaining: const Duration(minutes: 5, seconds: 30),
          backgroundColor: const Color(0xFF1A120B),
          breathingEnabled: false,
          endingAnimationEnabled: false,
          fadeProgress: 0.0,
          onStop: () {},
        ),
      ));
      expect(find.text('5:30'), findsOneWidget);
    });

    testWidgets('長押しで停止ボタンが表示される', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: SessionScreen(
          remaining: const Duration(minutes: 5),
          backgroundColor: const Color(0xFF1A120B),
          breathingEnabled: false,
          endingAnimationEnabled: false,
          fadeProgress: 0.0,
          onStop: () {},
        ),
      ));
      final gesture = await tester
          .startGesture(tester.getCenter(find.byType(SessionScreen)));
      await tester.pump(const Duration(milliseconds: 900));
      await gesture.up();
      await tester.pump();
      expect(find.text('停止'), findsOneWidget);
    });
  });
}
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/features/session/session_screen_test.dart
```

Expected: FAIL

**Step 3: SessionScreenを実装する**

`lib/features/session/session_screen.dart`:

```dart
import 'dart:async';
import 'package:flutter/material.dart';

class SessionScreen extends StatefulWidget {
  final Duration remaining;
  final Color backgroundColor;
  final bool breathingEnabled;
  final bool endingAnimationEnabled;
  final double fadeProgress;
  final VoidCallback onStop;

  const SessionScreen({
    super.key,
    required this.remaining,
    required this.backgroundColor,
    required this.breathingEnabled,
    required this.endingAnimationEnabled,
    required this.fadeProgress,
    required this.onStop,
  });

  @override
  State<SessionScreen> createState() => _SessionScreenState();
}

class _SessionScreenState extends State<SessionScreen>
    with TickerProviderStateMixin {
  late AnimationController _breathingCtrl;
  late Animation<double> _breathingAnim;
  bool _showStop = false;
  Timer? _stopTimer;

  @override
  void initState() {
    super.initState();
    _breathingCtrl = AnimationController(
        vsync: this, duration: const Duration(seconds: 4))
      ..repeat(reverse: true);
    _breathingAnim =
        CurvedAnimation(parent: _breathingCtrl, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _breathingCtrl.dispose();
    _stopTimer?.cancel();
    super.dispose();
  }

  void _onLongPress() {
    setState(() => _showStop = true);
    _stopTimer?.cancel();
    _stopTimer = Timer(const Duration(seconds: 3), () {
      if (mounted) setState(() => _showStop = false);
    });
  }

  String _fmt(Duration d) {
    final m = d.inMinutes.remainder(60);
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onLongPress: _onLongPress,
      child: AnimatedBuilder(
        animation: _breathingAnim,
        builder: (_, __) {
          final brightness =
              widget.breathingEnabled ? _breathingAnim.value * 0.08 : 0.0;
          final bg = _adjustBrightness(widget.backgroundColor, brightness);
          return Scaffold(
            backgroundColor: bg,
            body: Stack(children: [
              if (widget.endingAnimationEnabled && widget.fadeProgress > 0)
                _GlowRing(progress: widget.fadeProgress),
              Center(
                child: Text(
                  _fmt(widget.remaining),
                  style: TextStyle(
                    color: Colors.white
                        .withValues(alpha: 1.0 - widget.fadeProgress * 0.8),
                    fontSize: 64,
                    fontWeight: FontWeight.w100,
                    letterSpacing: 4,
                  ),
                ),
              ),
              if (_showStop)
                Center(
                  child: GestureDetector(
                    onTap: widget.onStop,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 32, vertical: 16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        color: Colors.white.withValues(alpha: 0.12),
                        border: Border.all(
                            color: Colors.white.withValues(alpha: 0.35)),
                      ),
                      child: const Text('停止',
                          style:
                              TextStyle(color: Colors.white, fontSize: 18)),
                    ),
                  ),
                ),
            ]),
          );
        },
      ),
    );
  }

  Color _adjustBrightness(Color color, double offset) {
    final hsl = HSLColor.fromColor(color);
    return hsl
        .withLightness((hsl.lightness + offset).clamp(0.0, 1.0))
        .toColor();
  }
}

class _GlowRing extends StatelessWidget {
  final double progress;
  const _GlowRing({required this.progress});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final radius = size.shortestSide * 0.4 * (1.0 - progress);
    return Center(
      child: Opacity(
        opacity: (1.0 - progress).clamp(0.0, 1.0),
        child: Container(
          width: radius * 2,
          height: radius * 2,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
                color: Colors.white.withValues(alpha: 0.3), width: 1),
            boxShadow: [
              BoxShadow(
                  color: Colors.white.withValues(alpha: 0.08),
                  blurRadius: 20,
                  spreadRadius: 5)
            ],
          ),
        ),
      ),
    );
  }
}
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/features/session/session_screen_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/features/session/session_screen.dart test/features/session/session_screen_test.dart
git commit -m "feat: 没入モード画面（呼吸アニメーション・光の輪・長押し停止）を追加"
```

---

## Task 12: 設定画面（SettingsScreen）

**Files:**
- Create: `lib/features/settings/settings_screen.dart`
- Create: `test/features/settings/settings_screen_test.dart`

**Step 1: テストを書く**

`test/features/settings/settings_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:deep_silence/core/settings/app_settings.dart';
import 'package:deep_silence/features/settings/settings_screen.dart';

void main() {
  testWidgets('設定画面に3つのトグルが表示される', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: SettingsScreen(
        settings: const AppSettings(),
        onChanged: (_) {},
      ),
    ));
    expect(find.text('呼吸アニメーション'), findsOneWidget);
    expect(find.text('終了演出'), findsOneWidget);
    expect(find.text('没入モード'), findsOneWidget);
  });

  testWidgets('フェードアウト時間スライダーが表示される', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: SettingsScreen(
        settings: const AppSettings(),
        onChanged: (_) {},
      ),
    ));
    expect(find.byType(Slider), findsOneWidget);
  });

  testWidgets('トグルをOFFにすると値が変わる', (tester) async {
    AppSettings current = const AppSettings();
    await tester.pumpWidget(MaterialApp(
      home: StatefulBuilder(
        builder: (_, setState) => SettingsScreen(
          settings: current,
          onChanged: (s) => setState(() => current = s),
        ),
      ),
    ));
    await tester.tap(find.byType(Switch).first);
    await tester.pump();
    expect(current.breathingAnimationEnabled, isFalse);
  });
}
```

**Step 2: テストが失敗することを確認する**

```bash
flutter test test/features/settings/settings_screen_test.dart
```

Expected: FAIL

**Step 3: SettingsScreenを実装する**

`lib/features/settings/settings_screen.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:deep_silence/core/settings/app_settings.dart';

class SettingsScreen extends StatelessWidget {
  final AppSettings settings;
  final ValueChanged<AppSettings> onChanged;

  const SettingsScreen({
    super.key,
    required this.settings,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0D0D),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('設定',
            style: TextStyle(color: Colors.white, fontSize: 16)),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        children: [
          _Header('タイマー設定'),
          _FadeSlider(
            value: settings.fadeDurationMinutes,
            onChanged: (v) =>
                onChanged(settings.copyWith(fadeDurationMinutes: v)),
          ),
          const SizedBox(height: 32),
          _Header('演出設定'),
          _ToggleRow(
            label: '呼吸アニメーション',
            description: '背景の微細な明滅',
            value: settings.breathingAnimationEnabled,
            onChanged: (v) => onChanged(
                settings.copyWith(breathingAnimationEnabled: v)),
          ),
          _ToggleRow(
            label: '終了演出',
            description: '光の輪が黒に沈む',
            value: settings.endingAnimationEnabled,
            onChanged: (v) =>
                onChanged(settings.copyWith(endingAnimationEnabled: v)),
          ),
          _ToggleRow(
            label: '没入モード',
            description: 'ステータスバーを非表示',
            value: settings.immersiveModeEnabled,
            onChanged: (v) =>
                onChanged(settings.copyWith(immersiveModeEnabled: v)),
          ),
        ],
      ),
    );
  }
}

class _Header extends StatelessWidget {
  final String title;
  const _Header(this.title);

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Text(title,
            style: TextStyle(
                color: Colors.white.withValues(alpha: 0.45),
                fontSize: 11,
                letterSpacing: 2)),
      );
}

class _FadeSlider extends StatelessWidget {
  final int value;
  final ValueChanged<int> onChanged;
  const _FadeSlider({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        const Text('フェードアウト時間',
            style: TextStyle(color: Colors.white, fontSize: 15)),
        Text('$value 分',
            style: TextStyle(
                color: Colors.white.withValues(alpha: 0.5), fontSize: 15)),
      ]),
      Slider(
        value: value.toDouble(),
        min: 1,
        max: 5,
        divisions: 4,
        activeColor: Colors.white.withValues(alpha: 0.7),
        inactiveColor: Colors.white.withValues(alpha: 0.15),
        onChanged: (v) => onChanged(v.round()),
      ),
    ]);
  }
}

class _ToggleRow extends StatelessWidget {
  final String label;
  final String description;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _ToggleRow({
    required this.label,
    required this.description,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label,
                style: const TextStyle(color: Colors.white, fontSize: 15)),
            Text(description,
                style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.4),
                    fontSize: 12)),
          ]),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: Colors.white,
            activeTrackColor: Colors.white.withValues(alpha: 0.3),
            inactiveThumbColor: Colors.white.withValues(alpha: 0.3),
            inactiveTrackColor: Colors.white.withValues(alpha: 0.1),
          ),
        ],
      ),
    );
  }
}
```

**Step 4: テストが通ることを確認する**

```bash
flutter test test/features/settings/settings_screen_test.dart
```

Expected: All tests PASS

**Step 5: コミットする**

```bash
git add lib/features/settings/ test/features/settings/
git commit -m "feat: 設定画面（フェードアウト時間・演出トグル）を追加"
```

---

## Task 13: main.dart（アプリ全体の組み立て）

**Files:**
- Modify: `lib/main.dart`

**Step 1: main.dartを以下で置き換える**

`lib/main.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

import 'core/settings/app_settings.dart';
import 'core/settings/settings_repository.dart';
import 'core/audio/audio_service.dart';
import 'features/session/session_view_model.dart';
import 'features/home/home_screen.dart';
import 'features/session/session_screen.dart';
import 'features/settings/settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final repo = SettingsRepository();
  await repo.init();
  runApp(DeepSilenceApp(settingsRepository: repo));
}

class DeepSilenceApp extends StatelessWidget {
  final SettingsRepository settingsRepository;
  const DeepSilenceApp({super.key, required this.settingsRepository});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => _AppState(settingsRepository),
      child: MaterialApp(
        title: 'Deep Silence',
        theme: ThemeData.dark().copyWith(scaffoldBackgroundColor: Colors.black),
        debugShowCheckedModeBanner: false,
        home: const _RootScreen(),
      ),
    );
  }
}

class _AppState extends ChangeNotifier {
  final SettingsRepository _repo;
  AppSettings _settings;
  bool _isPlaying = false;

  _AppState(this._repo) : _settings = _repo.settings;

  AppSettings get settings => _settings;
  bool get isPlaying => _isPlaying;

  Future<void> updateSettings(AppSettings s) async {
    _settings = s;
    await _repo.save(s);
    notifyListeners();
  }

  void setPlaying(bool v) {
    _isPlaying = v;
    notifyListeners();
  }
}

class _RootScreen extends StatefulWidget {
  const _RootScreen();

  @override
  State<_RootScreen> createState() => _RootScreenState();
}

class _RootScreenState extends State<_RootScreen> {
  SessionViewModel? _vm;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _maybeShowVolumeWarning());
  }

  Future<void> _maybeShowVolumeWarning() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getBool('volume_warning_shown') == true) return;
    if (!mounted) return;
    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A1A),
        title: const Text('音量について',
            style: TextStyle(color: Colors.white)),
        content: const Text(
          '安全な聴取のために、デバイス音量の60%（80dB以下）以下でのご使用をお勧めします。',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('わかりました',
                style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
    await prefs.setBool('volume_warning_shown', true);
  }

  Future<void> _startSession(AppSettings settings) async {
    if (settings.immersiveModeEnabled) {
      await SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
    }
    await WakelockPlus.enable();

    final vm = SessionViewModel(
        audioService: AudioService(), settings: settings);
    vm.addListener(_onVmUpdate);
    setState(() => _vm = vm);
    await vm.startSession();
    if (mounted) context.read<_AppState>().setPlaying(true);
  }

  void _onVmUpdate() {
    final vm = _vm;
    if (vm == null) return;
    if (!vm.isPlaying && vm.timerState == TimerState.completed) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _endSession());
    }
  }

  Future<void> _endSession() async {
    final vm = _vm;
    if (vm == null) return;
    vm.removeListener(_onVmUpdate);
    await vm.stopSession();
    vm.dispose();
    setState(() => _vm = null);
    await SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    await WakelockPlus.disable();
    if (mounted) context.read<_AppState>().setPlaying(false);
  }

  @override
  void dispose() {
    _vm?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<_AppState>();

    if (appState.isPlaying && _vm != null) {
      final settings = appState.settings;
      final bgColor = settings.noiseType == NoiseType.brown
          ? const Color(0xFF1A120B)
          : const Color(0xFF0A2647);
      return ListenableBuilder(
        listenable: _vm!,
        builder: (_, __) => SessionScreen(
          remaining: _vm!.remaining,
          backgroundColor: bgColor,
          breathingEnabled: settings.breathingAnimationEnabled,
          endingAnimationEnabled: settings.endingAnimationEnabled,
          fadeProgress: _vm!.fadeProgress,
          onStop: _endSession,
        ),
      );
    }

    return HomeScreen(
      settings: appState.settings,
      onSettingsChanged: (s) => appState.updateSettings(s),
      onStart: () => _startSession(appState.settings),
      onOpenSettings: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => SettingsScreen(
            settings: appState.settings,
            onChanged: (s) => appState.updateSettings(s),
          ),
        ),
      ),
    );
  }
}
```

**Step 2: アプリが起動することを確認する**

```bash
flutter run
```

Expected: ホーム画面が表示され、初回は音量警告ダイアログが表示される。

**Step 3: コミットする**

```bash
git add lib/main.dart
git commit -m "feat: main.dartにアプリ全体の組み立てを追加"
```

---

## Task 14: 全テスト実行・静的解析・最終確認

**Step 1: 全テストを実行する**

```bash
flutter test
```

Expected: All tests PASS。失敗したテストは修正してから次に進む。

**Step 2: 静的解析を実行する**

```bash
flutter analyze
```

Expected: `No issues found!`

**Step 3: Androidデバッグビルド確認**

```bash
flutter build apk --debug
```

Expected: `BUILD SUCCESSFUL`

**Step 4: iOSデバッグビルド確認（Macがある場合）**

```bash
flutter build ios --no-codesign
```

Expected: `Build complete.`

**Step 5: 最終コミット**

```bash
git add .
git commit -m "test: 全テスト・静的解析クリア・ビルド確認"
```

---

## 注意事項

### `withOpacity` 非推奨について
Flutter 3.x以降、`Color.withOpacity()` は非推奨。コード内では `Color.withValues(alpha: x)` を使用している。

### LPFのMVP方針
Platform ChannelのLPF実装はシェルのみ（MVP）。音量フェードはDart側（`AudioService.setVolume`）で実現済み。実際のLPFフィルタ適用はv2タスクとして別途計画する。

### バックグラウンド再生
`audio_session` パッケージが `just_audio` と組み合わさることで、iOS/Androidのバックグラウンド再生が有効になる。`AndroidManifest.xml` の `WAKE_LOCK` パーミッションも追加済み。
