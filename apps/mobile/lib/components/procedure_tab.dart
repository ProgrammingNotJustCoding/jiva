import 'package:flutter/material.dart';

class ProcedureTab extends StatelessWidget {
  const ProcedureTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'Standard Procedures',
        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      ),
    );
  }
}
