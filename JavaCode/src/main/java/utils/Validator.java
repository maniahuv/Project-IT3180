package utils;

public class Validator {

	public static boolean validEmail(String email) {
		if (!validLength(email, 100, false)) {
			return false;
		}
		//String regexPattern = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
		//return Pattern.compile(regexPattern).matcher(email).matches();
		return true;
	}

	public static boolean validLength(String string, int maxLength, boolean nullable) {
		return string != null && (nullable || string.length() > 0) && string.length() <= maxLength;
	}

	// Kiểm tra xem chuỗi có phải toàn chữ cái không
	public static boolean isAllAlphabet(String input) {
		for (char c : input.toCharArray()) {
			if (!Character.isLetter(c)) {
				return false;
			}
		}
		return true;
	}

	// Kiểm tra chuỗi có chứa chữ số không
	public static boolean containsDigit(String input) {
		for (char c : input.toCharArray()) {
			if (Character.isDigit(c)) {
				return true;
			}
		}
		return false;
	}

	// Kiểm tra chuỗi có chứa chữ số không
	public static boolean isAllDigit(String input) {
		for (char c : input.toCharArray()) {
			if (!Character.isDigit(c)) {
				return false;
			}
		}
		return true;
	}

}
