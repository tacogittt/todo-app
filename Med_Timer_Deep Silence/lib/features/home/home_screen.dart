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
      : const Color(0xFF071A0B);

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
