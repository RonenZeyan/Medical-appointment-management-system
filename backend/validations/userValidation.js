const registerValidation = (user_data) => {
  let errors = [];

  // Ensures first and last name using only Hebrew or English letters, with at least two characters per name.
  const nameRegex = /^[a-zA-Zא-ת]{2,}[\s'-][a-zA-Zא-ת]{2,}([\s'-][a-zA-Zא-ת]{2,})*$/;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
  // Ensures valid Israeli number with the correct prefix and at least 7 digits.
  const phoneRegex = /^(\+972[-\s]?|0)([23489]|5[0-9])[-\s]?\d{7}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, 1 uppercase, 1 number

  // Validate Email (only if provided)
  if (user_data.email && !emailRegex.test(user_data.email)) {
    errors.push("אימייל לא תקין. אנא הזן אימייל בפורמט תקין.");
  }

  // Validate Full Name (only if provided)
  if (user_data.full_name && !nameRegex.test(user_data.full_name)) {
    errors.push(
      "יש להזין שם פרטי ושם משפחה באותיות עברית או אנגלית בלבד, עם לפחות שני תווים בכל שם"
    );
  }

  // Validate Phone (only if provided)
  if (user_data.phone && !phoneRegex.test(user_data.phone)) {
    errors.push(
      "מספר הטלפון אינו תקין. יש להזין מספר ישראלי חוקי עם קידומת מתאימה ולפחות 7 ספרות."
    );
  }

  // Validate Password (only if provided)
  if (user_data.password && !passwordRegex.test(user_data.password)) {
    errors.push("הסיסמה חייבת להכיל לפחות 8 תווים, כולל מספר ואות גדולה.");
  }

  return errors.length > 0 ? { error: errors } : { success: true };
};

module.exports = { registerValidation };
