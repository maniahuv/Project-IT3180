package main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TestController {

	@RequestMapping("/Home")
	public String home() {
		return "trang1";
	}

	@RequestMapping("/dangNhap")
	public String dangNhap() {
		return "manHinhDangNhapDangKi";
	}

	@RequestMapping("/Profiles")
	public String profiles() {
		return "manHinhQuanLiTaiKhoan";
	}

	@RequestMapping("/DotThu")
	public String dotThu() {
		return "QuanLiDotThu";
	}

	@RequestMapping("/HoKhau")
	public String hoKhau() {
		return "QuanLiHoKhau";
	}

	@RequestMapping("/KhoanThu")
	public String khoanThu() {
		return "QuanLiKhoanThu";
	}

	@RequestMapping("/NhanKhau")
	public String nhanKhau() {
		return "QuanLiNhanKhau";
	}

	@RequestMapping("/TamTruTamVang")
	public String tamTru() {
		return "TamTruTamVang";
	}

	@RequestMapping("/Them")
	public String them() {
		return "trangThemTaiKhoan";
	}

	@RequestMapping("/PhieuThu")
	public String phieuThu() {
		return "XemPhieuThu";
	}

}
