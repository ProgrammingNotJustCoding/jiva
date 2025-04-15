import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/auth_service.dart';
import '../services/shift_service.dart';
import '../services/incident_service.dart';

class ReportTab extends StatefulWidget {
  const ReportTab({super.key});

  @override
  State<ReportTab> createState() => _ReportTabState();
}

class _ReportTabState extends State<ReportTab> {
  final _formKey = GlobalKey<FormState>();
  final AuthService _authService = AuthService();
  final ShiftService _shiftService = ShiftService();
  final IncidentService _incidentService = IncidentService();
  final ImagePicker _picker = ImagePicker();

  String _reportType = 'hazard';
  String _locationDescription = '';
  String _description = '';
  String _initialSeverity = 'low';
  String _rootCause = '';
  File? _imageFile;

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

  Future<void> _takePicture() async {
    final XFile? pickedFile = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 80,
    );

    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
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
        final success = await _incidentService.reportIncident(
          shiftId: _shiftId!,
          reportedByUserId: _userId!,
          reportType: _reportType,
          locationDescription: _locationDescription,
          gpsLatitude: '37.7749',
          gpsLongitude: '-122.4194',
          description: _description,
          initialSeverity: _initialSeverity,
          rootCause: _rootCause,
          attachment: _imageFile,
        );

        setState(() {
          _isLoading = false;
        });

        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Incident reported successfully')),
          );
          _resetForm();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Failed to report incident. Please try again.'),
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
      _reportType = 'hazard';
      _locationDescription = '';
      _description = '';
      _initialSeverity = 'low';
      _rootCause = '';
      _imageFile = null;
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
              'No active shift found. You need an active shift to report incidents.',
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
                        'Report an Incident',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 24),

                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Incident Type',
                          border: OutlineInputBorder(),
                        ),
                        value: _reportType,
                        items: const [
                          DropdownMenuItem(
                            value: 'hazard',
                            child: Text('Hazard'),
                          ),
                          DropdownMenuItem(
                            value: 'near_miss',
                            child: Text('Near Miss'),
                          ),
                          DropdownMenuItem(
                            value: 'accident',
                            child: Text('Accident'),
                          ),
                          DropdownMenuItem(
                            value: 'environmental',
                            child: Text('Environmental'),
                          ),
                          DropdownMenuItem(
                            value: 'other',
                            child: Text('Other'),
                          ),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _reportType = value!;
                          });
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please select an incident type';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Location Description',
                          hintText:
                              'e.g., North wing, 3rd floor, near elevator',
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 2,
                        onSaved: (value) {
                          _locationDescription = value ?? '';
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please describe the location';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Incident Description',
                          hintText: 'Describe what happened in detail',
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 4,
                        onSaved: (value) {
                          _description = value ?? '';
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please describe the incident';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Severity',
                          border: OutlineInputBorder(),
                        ),
                        value: _initialSeverity,
                        items: const [
                          DropdownMenuItem(value: 'low', child: Text('Low')),
                          DropdownMenuItem(
                            value: 'medium',
                            child: Text('Medium'),
                          ),
                          DropdownMenuItem(value: 'high', child: Text('High')),
                          DropdownMenuItem(
                            value: 'critical',
                            child: Text('Critical'),
                          ),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _initialSeverity = value!;
                          });
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please select severity level';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Root Cause (Optional)',
                          hintText: 'What might have caused this incident?',
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 2,
                        onSaved: (value) {
                          _rootCause = value ?? '';
                        },
                      ),
                      const SizedBox(height: 16),

                      const Text(
                        'Photo Evidence (Optional)',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),

                      Row(
                        children: [
                          ElevatedButton.icon(
                            onPressed: _takePicture,
                            icon: const Icon(Icons.camera_alt),
                            label: const Text('Take Photo'),
                          ),
                          const SizedBox(width: 16),
                          _imageFile != null
                              ? Expanded(
                                child: Stack(
                                  alignment: Alignment.topRight,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.file(
                                        _imageFile!,
                                        height: 100,
                                        width: double.infinity,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(
                                        Icons.cancel,
                                        color: Colors.red,
                                      ),
                                      onPressed: () {
                                        setState(() {
                                          _imageFile = null;
                                        });
                                      },
                                    ),
                                  ],
                                ),
                              )
                              : const Expanded(
                                child: Text('No photo attached'),
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
                              'Submit Report',
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
