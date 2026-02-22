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

    canvas.drawCircle(
        center,
        radius,
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
