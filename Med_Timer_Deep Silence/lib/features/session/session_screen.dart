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
