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
