package controller;

import java.sql.Date;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import model.KhoanThu;
import repository.KhoanThuDao;
import service.KhoanThuService;

@RestController
public class QuanLiKhoanThuController {

	@PostMapping("/tao-khoan-thu")
	public String taoKhoanThu(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("CREATE");
		if (KhoanThuService.themMoi("Admin", new KhoanThu(KhoanThuDao.instance.generateID(), newTr.get(1),
				Double.parseDouble(newTr.get(2)), Date.valueOf(newTr.get(3)), newTr.get(4)))) {
			System.out.println("Tao khoan thu thanh cong");
		} else {
			System.out.println("Tao khoan thu that bai");
		}
		return "QuanLiKhoanThu";
	}

	@PostMapping("/save-khoan-thu")
	public String luuKhoanThu(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("SAVE");
		if (KhoanThuService.capNhat("Admin", new KhoanThu(KhoanThuDao.instance.generateID(), newTr.get(1),
				Double.parseDouble(newTr.get(2)), Date.valueOf(newTr.get(3)), newTr.get(4)))) {
			System.out.println("Luu khoan thu thanh cong");
		} else {
			System.out.println("Luu khoan thu that bai");
		}
		return "QuanLiKhoanThu";
	}

	@PostMapping("/xoa-khoan-thu")
	public String xoaKhoanThu(@RequestBody String id) {
		System.out.println(String.format("Delete %s", id));
		if (KhoanThuService.xoa("Admin", id)) {
			System.out.println("Xoa khoan thu thanh cong");
		} else {
			System.out.println("Xoa khoan thu that bai");
		}
		return "QuanLiKhoanThu";
	}

	@GetMapping("/get-khoan-thu")
	public List<KhoanThu> getAllKhoanThu() {
		System.out.println("LOAD");
		return KhoanThuDao.instance.selectAll();
	}

}
