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
