class User {
  final String id;
  final String name;
  final String role;
  final String userCode;

  User({
    required this.id,
    required this.name,
    required this.role,
    required this.userCode,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'].toString(),
      name: json['name'],
      role: json['role'],
      userCode: json['userCode'],
    );
  }
}
