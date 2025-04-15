import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../components/shift_tab.dart';
import '../components/report_tab.dart';
import '../components/procedure_tab.dart';
import '../components/log_tab.dart';
import 'auth_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final AuthService _authService = AuthService();
  User? _user;
  bool _isLoading = true;
  bool _isError = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _tabController.addListener(_handleTabChange);
    _verifyUser();
  }

  @override
  void dispose() {
    _tabController.removeListener(_handleTabChange);
    _tabController.dispose();
    super.dispose();
  }

  void _handleTabChange() {}

  Future<void> _verifyUser() async {
    setState(() {
      _isLoading = true;
      _isError = false;
    });

    try {
      final user = await _authService.verifyToken();

      if (user == null) {
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const LoginScreen()),
          );
        }
        return;
      }

      setState(() {
        _user = user;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isError = true;
        _isLoading = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Authentication error. Please log in again.'),
          ),
        );

        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
    }
  }

  Future<void> _handleLogout() async {
    await _authService.logout();
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_user != null ? 'Welcome, ${_user!.name}' : 'Dashboard'),
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: _handleLogout),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.access_time), text: 'Shift'),
            Tab(icon: Icon(Icons.assignment), text: 'Report'),
            Tab(icon: Icon(Icons.list_alt), text: 'Procedure'),
            Tab(icon: Icon(Icons.history), text: 'Log'),
          ],
        ),
      ),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _isError
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Failed to authenticate. Please try again.'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _verifyUser,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              )
              : TabBarView(
                controller: _tabController,
                children: const [
                  ShiftTab(),
                  ReportTab(),
                  ProcedureTab(),
                  LogTab(),
                ],
              ),
    );
  }
}
