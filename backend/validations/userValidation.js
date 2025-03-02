
const registerValidation = (user_data) => {
    let errors = [];

    // Regex Patterns (Same as Frontend)
    const minFullNameLengthRegex = /^.{5,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    const minPhoneLengthRegex = /^.{7,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, 1 uppercase, 1 number

    // Validate Email (only if provided)
    if (user_data.email && !emailRegex.test(user_data.email)) {
        errors.push("אימייל לא תקין. אנא הזן אימייל בפורמט תקין.");
    }

    // Validate Full Name (only if provided)
    if (user_data.full_name && !minFullNameLengthRegex.test(user_data.full_name)) {
        errors.push("שם המלא חייב להכיל לפחות 5 תווים.");
    }

    // Validate Phone (only if provided)
    if (user_data.phone && !minPhoneLengthRegex.test(user_data.phone)) {
        errors.push("מספר הטלפון חייב להכיל לפחות 7 תווים.");
    }

    // Validate Password (only if provided)
    if (user_data.password && !passwordRegex.test(user_data.password)) {
        errors.push("הסיסמה חייבת להכיל לפחות 8 תווים, כולל מספר ואות גדולה.");
    }

    return errors.length > 0 ? { error: errors } : { success: true };
};


module.exports = { registerValidation };