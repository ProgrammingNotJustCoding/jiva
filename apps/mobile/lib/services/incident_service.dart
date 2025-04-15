import 'dart:io';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';
import 'auth_service.dart';

class IncidentService {
  final AuthService _authService = AuthService();

  Future<bool> reportIncident({
    required String shiftId,
    required String reportedByUserId,
    required String reportType,
    required String locationDescription,
    required String gpsLatitude,
    required String gpsLongitude,
    required String description,
    required String initialSeverity,
    required String rootCause,
    File? attachment,
  }) async {
    try {
      final token = await _authService.getToken();

      if (token == null) {
        return false;
      }

      final uri = Uri.parse(
        '${ApiConstants.incidentBaseUrl}${ApiConstants.incidentEndpoint}',
      );

      var request = http.MultipartRequest('POST', uri);

      request.headers.addAll({'Authorization': 'Bearer $token'});

      request.fields['shiftId'] = shiftId;
      request.fields['reportType'] = reportType;
      request.fields['reporttedByUserId'] = reportedByUserId;
      request.fields['locationDescription'] = locationDescription;
      request.fields['gpsLatitude'] = gpsLatitude;
      request.fields['gpsLongitude'] = gpsLongitude;
      request.fields['description'] = description;
      request.fields['initialSeverity'] = initialSeverity;
      request.fields['status'] = 'reported';
      request.fields['rootCause'] = rootCause.isEmpty ? 'unknown' : rootCause;

      if (attachment != null) {
        var file = await http.MultipartFile.fromPath(
          'attachments[0]',
          attachment.path,
          filename: 'image_${DateTime.now().millisecondsSinceEpoch}.jpg',
        );
        request.files.add(file);
      }

      var response = await request.send();

      return response.statusCode == 201;
    } catch (e) {
      print('Error reporting incident: $e');
      return false;
    }
  }
}
