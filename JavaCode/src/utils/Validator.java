package utils;

public class Validator {

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
