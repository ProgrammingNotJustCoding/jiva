import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';
import 'auth_service.dart';

class Task {
  final int workplanId;
  final String taskDescription;
  final String status;
  final int? id;

  Task({
    required this.workplanId,
    required this.taskDescription,
    required this.status,
    this.id,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      workplanId: json['workplanId'],
      taskDescription: json['taskDescription'],
      status: json['status'],
      id: json['id'],
    );
  }
}

class TasksService {
  final AuthService _authService = AuthService();

  Future<List<Task>> getTasksForWorker(String userId) async {
    try {
      final token = await _authService.getToken();

      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await http.get(
        Uri.parse(
          '${ApiConstants.workplanBaseUrl}${ApiConstants.workerTasksEndpoint}/$userId',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final List<dynamic> tasksJson = jsonResponse['data'];
        return tasksJson.map((task) => Task.fromJson(task)).toList();
      } else {
        throw Exception('Failed to load tasks: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching tasks: $e');
    }
  }

  Future<bool> markTaskAsCompleted(int taskId) async {
    try {
      final token = await _authService.getToken();

      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await http.put(
        Uri.parse(
          '${ApiConstants.workplanBaseUrl}${ApiConstants.tasksEndpoint}/$taskId',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'status': 'completed'}),
      );

      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Error updating task: $e');
    }
  }
}
