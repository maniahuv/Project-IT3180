package main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

	@RequestMapping("/")
	public String home() {
		return "trang1";
	}

	@RequestMapping("/Login")
	public String login() {
		return "manHinhDangNhapDangKi";
	}

	@RequestMapping("/Register")
	public String register() {
		return "trangThemTaiKhoan";
	}

	@RequestMapping("/Profiles")
	public String mapProfiles() {
		return "manHinhQuanLiTaiKhoan";
	}

}
