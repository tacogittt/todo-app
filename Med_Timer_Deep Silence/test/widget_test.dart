import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:deep_silence/core/settings/settings_repository.dart';
import 'package:deep_silence/main.dart';

void main() {
  testWidgets('DeepSilenceApp スモークテスト: ホーム画面が表示される',
      (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({'volume_warning_shown': true});
    final repo = SettingsRepository();
    await repo.init();

    await tester.pumpWidget(DeepSilenceApp(settingsRepository: repo));
    await tester.pumpAndSettle();

    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
