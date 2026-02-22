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
