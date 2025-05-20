package dao;

import java.util.ArrayList;
import java.util.List;

public interface DataAccessObjectI<T> {
	public int insert(T t);

	public int update(T t);

	public int delete(T t);

	public List<T> selectALL();

	public T selectByID(T t);

	public ArrayList<T> selectALL(String condition);
}
