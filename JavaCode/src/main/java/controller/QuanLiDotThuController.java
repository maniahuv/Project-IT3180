package controller;

import java.sql.Date;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import model.DotThu;
import repository.DotThuDao;
import service.DotThuService;

@RestController
public class QuanLiDotThuController {

	@PostMapping("/tao-dot-thu")
	public String taoDotThu(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("CREATE");
		if (DotThuService.themMoi("Admin",
				new DotThu(DotThuDao.instance.generateID(), newTr.get(1), Date.valueOf(newTr.get(2)),
						Date.valueOf(newTr.get(3)), newTr.get(4), Integer.parseInt(newTr.get(5))))) {
			System.out.println("Tao dot thu thanh cong");
		} else {
			System.out.println("Tao dot thu that bai");
		}
		return "QuanLiDotThu";
	}

	@PostMapping("/save-dot-thu")
	public String luuDotThu(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("SAVE");
		if (DotThuService.capNhat("Admin", new DotThu(newTr.get(0), newTr.get(1), Date.valueOf(newTr.get(2)),
				Date.valueOf(newTr.get(3)), newTr.get(4), Integer.parseInt(newTr.get(5))))) {
			System.out.println("Luu dot thu thanh cong");
		} else {
			System.out.println("Luu dot thu that bai");
		}
		return "QuanLiDotThu";
	}

	@PostMapping("/xoa-dot-thu")
	public String xoaDotThu(@RequestBody String id) {
		System.out.println(String.format("Delete %s", id));
		if (DotThuService.xoa("Admin", id)) {
			System.out.println("Xoa dot thu thanh cong");
		} else {
			System.out.println("Xoa dot thu that bai");
		}
		return "QuanLiDotThu";
	}

	@GetMapping("/get-dot-thu")
	public List<DotThu> getAllDotThu() {
		System.out.println("LOAD");
		return DotThuDao.instance.selectAll();
	}

}
