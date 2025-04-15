import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/constants.dart';
import '../models/user.dart';

class AuthService {
  final _storage = const FlutterSecureStorage();

  Future<bool> signIn(String userCode, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.signInEndpoint}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'userCode': userCode, 'password': password}),
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final token = jsonResponse['data']['token'];

        await _storage.write(key: StorageKeys.authToken, value: token);
        return true;
      }
      return false;
    } catch (e) {
      rethrow;
    }
  }

  Future<String?> getToken() async {
    return await _storage.read(key: StorageKeys.authToken);
  }

  Future<String?> getUserId() async {
    return await _storage.read(key: StorageKeys.userId);
  }

  Future<void> logout() async {
    await _storage.delete(key: StorageKeys.authToken);
    await _storage.delete(key: StorageKeys.userId);
  }

  Future<User?> verifyToken() async {
    try {
      final token = await getToken();
      if (token == null) {
        return null;
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.verifyEndpoint}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final user = User.fromJson(jsonResponse['data']);

        await _storage.write(key: StorageKeys.userId, value: user.id);

        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
