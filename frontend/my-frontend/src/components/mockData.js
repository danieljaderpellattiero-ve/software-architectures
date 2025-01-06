const mockUsers = [
  { email: "test@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
];

export function loginUser(email, password) {
  const user = mockUsers.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    return { success: true, message: "Login successful", user };
  }
  return { success: false, message: "Invalid credentials" };
}

export function registerUser(email, password) {
  // Имитируем создание нового пользователя
  mockUsers.push({ email, password });
  return { success: true, message: "Registration successful" };
}
