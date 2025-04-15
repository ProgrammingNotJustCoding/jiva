import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/shift_service.dart';
import '../services/log_service.dart';

class LogTab extends StatefulWidget {
  const LogTab({super.key});

  @override
  State<LogTab> createState() => _LogTabState();
}

class _LogTabState extends State<LogTab> {
  final _formKey = GlobalKey<FormState>();
  final AuthService _authService = AuthService();
  final ShiftService _shiftService = ShiftService();
  final LogService _logService = LogService();

  String _category = 'operation';
  String _details = '';
  String? _relatedEquipment;
  String? _location;

  bool _isLoading = false;
  bool _hasShift = false;
  String? _userId;
  String? _shiftId;

  @override
  void initState() {
    super.initState();
    _checkData();
  }

  Future<void> _checkData() async {
    final userId = await _authService.getUserId();
    final shiftId = await _shiftService.getShiftId();

    setState(() {
      _userId = userId;
      _shiftId = shiftId;
      _hasShift = shiftId != null;
    });

    if (!_hasShift) {
      await _shiftService.getCurrentShift();
      final updatedShiftId = await _shiftService.getShiftId();
      setState(() {
        _shiftId = updatedShiftId;
        _hasShift = updatedShiftId != null;
      });
    }
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      if (_userId == null || _shiftId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Missing user ID or shift data. Please try again.'),
          ),
        );
        return;
      }

      setState(() {
        _isLoading = true;
      });

      try {
        final success = await _logService.postLog(
          shiftId: _shiftId!,
          workerId: _userId!,
          category: _category,
          details: _details,
          relatedEquipment: _relatedEquipment,
          location: _location,
        );

        setState(() {
          _isLoading = false;
        });

        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Log submitted successfully')),
          );
          _resetForm();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Failed to submit log. Please try again.'),
            ),
          );
        }
      } catch (e) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  void _resetForm() {
    setState(() {
      _category = 'operation';
      _details = '';
      _relatedEquipment = null;
      _location = null;
    });
    _formKey.currentState?.reset();
  }

  @override
  Widget build(BuildContext context) {
    if (!_hasShift) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'No active shift found. You need an active shift to submit logs.',
            ),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _checkData, child: const Text('Refresh')),
          ],
        ),
      );
    }

    return Scaffold(
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Submit Shift Log',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 24),

                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Category',
                          border: OutlineInputBorder(),
                        ),
                        value: _category,
                        items: const [
                          DropdownMenuItem(
                            value: 'operation',
                            child: Text('Operation'),
                          ),
                          DropdownMenuItem(
                            value: 'equipment',
                            child: Text('Equipment'),
                          ),
                          DropdownMenuItem(
                            value: 'safety',
                            child: Text('Safety'),
                          ),
                          DropdownMenuItem(
                            value: 'instruction',
                            child: Text('Instruction'),
                          ),
                          DropdownMenuItem(
                            value: 'personnel',
                            child: Text('Personnel'),
                          ),
                          DropdownMenuItem(
                            value: 'environment',
                            child: Text('Environment'),
                          ),
                          DropdownMenuItem(
                            value: 'other',
                            child: Text('Other'),
                          ),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _category = value!;
                          });
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please select a category';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Details',
                          hintText: 'Describe the activity or observation',
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 4,
                        onSaved: (value) {
                          _details = value ?? '';
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please provide details';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      ExpansionTile(
                        title: const Text('Additional Information (Optional)'),
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: TextFormField(
                              decoration: const InputDecoration(
                                labelText: 'Related Equipment',
                                hintText: 'Any equipment involved',
                                border: OutlineInputBorder(),
                              ),
                              onSaved: (value) {
                                _relatedEquipment = value;
                              },
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: TextFormField(
                              decoration: const InputDecoration(
                                labelText: 'Location',
                                hintText: 'Specific location within the site',
                                border: OutlineInputBorder(),
                              ),
                              onSaved: (value) {
                                _location = value;
                              },
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 32),

                      Center(
                        child: SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: _submitForm,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Theme.of(context).primaryColor,
                              foregroundColor: Colors.white,
                            ),
                            child: const Text(
                              'Submit Log',
                              style: TextStyle(fontSize: 18),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
    );
  }
}
