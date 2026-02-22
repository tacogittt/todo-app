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
