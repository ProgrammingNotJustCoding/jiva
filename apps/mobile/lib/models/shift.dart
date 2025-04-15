class ShiftPerson {
  final int id;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String designation;

  ShiftPerson({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    required this.designation,
  });

  factory ShiftPerson.fromJson(Map<String, dynamic> json) {
    return ShiftPerson(
      id: json['id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      phoneNumber: json['phoneNumber'],
      designation: json['designation'],
    );
  }

  String get fullName => '$firstName $lastName';
}

class ShiftWorker {
  final int id;
  final int shiftId;
  final int workerId;
  final int supervisorId;
  final ShiftPerson worker;

  ShiftWorker({
    required this.id,
    required this.shiftId,
    required this.workerId,
    required this.supervisorId,
    required this.worker,
  });

  factory ShiftWorker.fromJson(Map<String, dynamic> json) {
    return ShiftWorker(
      id: json['id'],
      shiftId: json['shiftId'],
      workerId: json['workerId'],
      supervisorId: json['supervisorId'],
      worker: ShiftPerson.fromJson(json['worker']),
    );
  }
}

class Shift {
  final int id;
  final int supervisorId;
  final ShiftPerson supervisor;
  final int? nextSupervisorId;
  final ShiftPerson? nextSupervisor;
  final DateTime startTime;
  final DateTime? endTime;
  final String status;
  final DateTime? finalizedAt;
  final DateTime? acknowledgedAt;
  final List<ShiftWorker> workers;

  Shift({
    required this.id,
    required this.supervisorId,
    required this.supervisor,
    this.nextSupervisorId,
    this.nextSupervisor,
    required this.startTime,
    this.endTime,
    required this.status,
    this.finalizedAt,
    this.acknowledgedAt,
    required this.workers,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['id'],
      supervisorId: json['supervisorId'],
      supervisor: ShiftPerson.fromJson(json['supervisor']),
      nextSupervisorId: json['nextSupervisorId'],
      nextSupervisor:
          json['nextSupervisor'] != null
              ? ShiftPerson.fromJson(json['nextSupervisor'])
              : null,
      startTime: DateTime.parse(json['startTime']),
      endTime: json['endTime'] != null ? DateTime.parse(json['endTime']) : null,
      status: json['status'],
      finalizedAt:
          json['finalizedAt'] != null
              ? DateTime.parse(json['finalizedAt'])
              : null,
      acknowledgedAt:
          json['acknowledgedAt'] != null
              ? DateTime.parse(json['acknowledgedAt'])
              : null,
      workers:
          (json['workers'] as List)
              .map((worker) => ShiftWorker.fromJson(worker))
              .toList(),
    );
  }
}
