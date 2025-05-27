package main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

	@RequestMapping("/Profiles")
	public String mapProfiles() {
		return "manHinhQuanLiTaiKhoan";
	}

}
