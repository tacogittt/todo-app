import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

import 'core/settings/app_settings.dart';
import 'core/settings/settings_repository.dart';
import 'core/audio/audio_service.dart';
import 'core/timer/timer_service.dart';
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
    WidgetsBinding.instance
        .addPostFrameCallback((_) => _maybeShowVolumeWarning());
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

    final vm =
        SessionViewModel(audioService: AudioService(), settings: settings);
    vm.addListener(_onVmUpdate);
    setState(() => _vm = vm);
    await vm.startSession();
    if (mounted) context.read<_AppState>().setPlaying(true);
  }

  void _onVmUpdate() {
    final vm = _vm;
    if (vm == null) return;
    if (!vm.isPlaying && vm.timerState == TimerState.completed) {
      WidgetsBinding.instance
          .addPostFrameCallback((_) => _endSession());
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
