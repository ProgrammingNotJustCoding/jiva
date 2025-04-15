import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/shift.dart';
import '../utils/constants.dart';
import 'auth_service.dart';

class ShiftService {
  final AuthService _authService = AuthService();
  final _storage = const FlutterSecureStorage();

  Future<Shift?> getCurrentShift() async {
    try {
      final token = await _authService.getToken();
      final userId = await _authService.getUserId();

      if (token == null || userId == null) {
        return null;
      }

      final response = await http.get(
        Uri.parse(
          '${ApiConstants.shiftBaseUrl}${ApiConstants.currentShiftEndpoint}/worker/$userId',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final shift = Shift.fromJson(jsonResponse['data']);

        await _storage.write(
          key: StorageKeys.shiftId,
          value: shift.id.toString(),
        );

        return shift;
      }
      return null;
    } catch (e) {
      print('Error fetching current shift: $e');
      return null;
    }
  }

  Future<String?> getShiftId() async {
    return await _storage.read(key: StorageKeys.shiftId);
  }
}
