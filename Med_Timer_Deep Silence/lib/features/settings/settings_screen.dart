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
            activeThumbColor: Colors.white,
            activeTrackColor: Colors.white.withValues(alpha: 0.3),
            inactiveThumbColor: Colors.white.withValues(alpha: 0.3),
            inactiveTrackColor: Colors.white.withValues(alpha: 0.1),
          ),
        ],
      ),
    );
  }
}
