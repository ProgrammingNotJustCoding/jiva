import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';
import 'auth_service.dart';

class LogService {
  final AuthService _authService = AuthService();

  Future<bool> postLog({
    required String shiftId,
    required String workerId,
    required String category,
    required String details,
    String? relatedEquipment,
    String? location,
  }) async {
    try {
      final token = await _authService.getToken();

      if (token == null) {
        return false;
      }

      final response = await http.post(
        Uri.parse('${ApiConstants.shiftBaseUrl}${ApiConstants.logsEndpoint}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'shiftId': shiftId,
          'workerId': workerId,
          'category': category,
          'details': details,
          if (relatedEquipment != null && relatedEquipment.isNotEmpty)
            'relatedEquipment': relatedEquipment,
          if (location != null && location.isNotEmpty) 'location': location,
        }),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Error posting log: $e');
      return false;
    }
  }
}
