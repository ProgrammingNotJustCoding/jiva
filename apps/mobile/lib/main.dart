import 'package:flutter/material.dart';
import 'screens/auth_screen.dart';
import 'utils/app_theme.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load();
  runApp(const JivaApp());
}

class JivaApp extends StatelessWidget {
  const JivaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jiva',
      theme: AppTheme.theme,
      home: const LoginScreen(),
    );
  }
}
