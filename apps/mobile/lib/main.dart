import 'package:flutter/material.dart';

void main() {
  runApp(const JivaApp());
}

class JivaApp extends StatelessWidget {
  const JivaApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jiva',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const Text('Hello, Jiva!'),
    );
  }
}
