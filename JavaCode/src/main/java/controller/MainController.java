package controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

	@RequestMapping("/")
	public String home() {
		return "trang1";
	}

	@RequestMapping("/login")
	public String login() {
		return "manHinhDangNhapDangKi";
	}

	@RequestMapping("/register")
	public String register() {
		return "trangThemTaiKhoan";
	}

	@RequestMapping("/profiles")
	public String mapProfiles() {
		return "manHinhQuanLiTaiKhoan";
	}

}
