package controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import model.HoKhau;
import repository.HoKhauDao;
import service.HoKhauService;

@RestController
public class QuanLiHoKhauController {

	@PostMapping("/tao-ho-khau")
	public String taoHoKhau(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("CREATE");
		if (HoKhauService.taoHoKhauMoi("Admin", new HoKhau(HoKhauDao.instance.generateID(), newTr.get(1),
				Double.parseDouble(newTr.get(2)), Integer.parseInt(newTr.get(3)), newTr.get(4)))) {
			System.out.println("Tao ho khau thanh cong");
		} else {
			System.out.println("Tao ho khau that bai");
		}
		return "QuanLiHoKhau";
	}

	@PostMapping("/save-ho-khau")
	public String luuHoKhau(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("SAVE");
		if (HoKhauService.luuBienDong("Admin", new HoKhau(newTr.get(0), newTr.get(1), Double.parseDouble(newTr.get(2)),
				Integer.parseInt(newTr.get(3)), newTr.get(4)))) {
			System.out.println("Luu ho khau thanh cong");
		} else {
			System.out.println("Luu ho khau that bai");
		}
		return "QuanLiHoKhau";
	}

	@PostMapping("/xoa-ho-khau")
	public String xoaHoKhau(@RequestBody String id) {
		System.out.println(String.format("Delete %s", id));
		if (HoKhauService.xoaHoKhau("Admin", id)) {
			System.out.println("Xoa ho khau thanh cong");
		} else {
			System.out.println("Xoa ho khau that bai");
		}
		return "QuanLiHoKhau";
	}

	@GetMapping("/get-ho-khau")
	public List<HoKhau> getAllHoKhau() {
		System.out.println("LOAD");
		return HoKhauDao.instance.selectAll();
	}

}
