import 'package:flutter/material.dart';
import '../services/tasks_service.dart';
import '../services/auth_service.dart';

class ProcedureTab extends StatefulWidget {
  const ProcedureTab({super.key});

  @override
  State<ProcedureTab> createState() => _ProcedureTabState();
}

class _ProcedureTabState extends State<ProcedureTab> {
  final TasksService _tasksService = TasksService();
  final AuthService _authService = AuthService();
  List<Task> _tasks = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchTasks();
  }

  Future<void> _fetchTasks() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final userId = await _authService.getUserId();

      if (userId == null) {
        setState(() {
          _error = 'User not authenticated';
          _isLoading = false;
        });
        return;
      }

      final tasks = await _tasksService.getTasksForWorker(userId);

      setState(() {
        _tasks = tasks;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Error: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _markTaskAsCompleted(int taskId) async {
    print('Marking task $taskId as completed');
    try {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Updating task status...')),
        );
      }

      final success = await _tasksService.markTaskAsCompleted(taskId);

      if (success) {
        setState(() {
          final taskIndex = _tasks.indexWhere((task) => task.id == taskId);
          if (taskIndex != -1) {
            final updatedTasks = List<Task>.from(_tasks);
            final oldTask = updatedTasks[taskIndex];
            final updatedTask = Task(
              workplanId: oldTask.workplanId,
              taskDescription: oldTask.taskDescription,
              status: 'completed',
              id: oldTask.id,
            );
            updatedTasks[taskIndex] = updatedTask;
            _tasks = updatedTasks;
          }
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Task marked as completed')),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to update task')),
          );
        }
      }
    } catch (e) {
      print('Error marking task as completed: $e');
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Error: $_error',
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _fetchTasks, child: const Text('Retry')),
          ],
        ),
      );
    }

    if (_tasks.isEmpty) {
      return const Center(
        child: Text('No tasks assigned', style: TextStyle(fontSize: 18)),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Assigned Tasks',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: _tasks.length,
              itemBuilder: (context, index) {
                final task = _tasks[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                task.taskDescription,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Status: ${task.status}',
                                style: TextStyle(
                                  color:
                                      task.status == 'pending'
                                          ? Colors.orange
                                          : Colors.green,
                                ),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton(
                          onPressed:
                              task.id != null
                                  ? () => _markTaskAsCompleted(task.id!)
                                  : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Mark Complete'),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
