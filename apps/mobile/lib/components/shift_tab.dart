import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/shift.dart';
import '../../services/shift_service.dart';

class ShiftTab extends StatefulWidget {
  const ShiftTab({super.key});

  @override
  State<ShiftTab> createState() => _ShiftTabState();
}

class _ShiftTabState extends State<ShiftTab> {
  final ShiftService _shiftService = ShiftService();
  Shift? _currentShift;
  bool _isLoading = true;
  bool _isError = false;

  @override
  void initState() {
    super.initState();
    _fetchCurrentShift();
  }

  Future<void> _fetchCurrentShift() async {
    setState(() {
      _isLoading = true;
      _isError = false;
    });

    try {
      final shift = await _shiftService.getCurrentShift();
      setState(() {
        _currentShift = shift;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isError = true;
        _isLoading = false;
      });
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return DateFormat('MMM dd, yyyy - hh:mm a').format(dateTime.toLocal());
  }

  String _getStatusString(String status) {
    switch (status) {
      case 'to_begin':
        return 'To Begin';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status.replaceAll('_', ' ').toUpperCase();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_isError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Failed to load shift data.'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _fetchCurrentShift,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_currentShift == null) {
      return const Center(child: Text('No active shift found.'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Shift #${_currentShift!.id}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color:
                          _currentShift!.status == 'to_begin'
                              ? Colors.orange
                              : _currentShift!.status == 'in_progress'
                              ? Colors.green
                              : Colors.blue,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _getStatusString(_currentShift!.status),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.access_time),
                      const SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Start Time',
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                          Text(
                            _formatDateTime(_currentShift!.startTime),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  if (_currentShift!.endTime != null) ...[
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Icon(Icons.access_time_filled),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'End Time',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                            Text(
                              _formatDateTime(_currentShift!.endTime!),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Supervisor',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ListTile(
                    leading: CircleAvatar(
                      child: Text(
                        _currentShift!.supervisor.firstName[0] +
                            _currentShift!.supervisor.lastName[0],
                      ),
                    ),
                    title: Text(_currentShift!.supervisor.fullName),
                    subtitle: Text(_currentShift!.supervisor.phoneNumber),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Workers',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _currentShift!.workers.length,
                    itemBuilder: (context, index) {
                      final worker = _currentShift!.workers[index].worker;
                      return ListTile(
                        leading: CircleAvatar(
                          child: Text(worker.firstName[0] + worker.lastName[0]),
                        ),
                        title: Text(worker.fullName),
                        subtitle: Text(worker.phoneNumber),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
