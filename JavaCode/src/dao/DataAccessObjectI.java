package dao;

import java.util.ArrayList;
import java.util.List;

import model.HoKhau;

public interface DataAccessObjectI<T> {
	public int insert(T t);

	public int update(T t);

	public int delete(T t);

	public List<HoKhau> selectALL();

	public T selectByID(T t);

	public ArrayList<T> selectALL(String condition);
}
