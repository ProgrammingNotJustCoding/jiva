import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConstants {
  static String get host => dotenv.env['API_HOST'] ?? 'localhost';

  static String get baseUrl =>
      'http://${host}:${dotenv.env['AUTH_PORT'] ?? '5001'}/api';

  static String get shiftBaseUrl =>
      'http://${host}:${dotenv.env['SHIFT_PORT'] ?? '5003'}/api';

  static String get incidentBaseUrl =>
      'http://${host}:${dotenv.env['INCIDENT_PORT'] ?? '5004'}/api';

  static const String signInEndpoint = "/auth/signin";
  static const String verifyEndpoint = "/auth/verify";
  static const String currentShiftEndpoint = "/shifts/current-shift";
  static const String logsEndpoint = "/logs";
  static const String incidentEndpoint = "/incidents";
}

class StorageKeys {
  static const String authToken = 'auth_token';
  static const String userId = 'user_id';
  static const String shiftId = 'shift_id';
}
