package view;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;

import dao.AccountDAO;
import dao.SinhvienDAO;
import database.JDBCUtil;
import model.Account;
import model.Sinhvien;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;

public class QLSVView extends JFrame {
	
	private static final long serialVersionUID = 1L;
	
	
    private JTextField txtID, txtName, txtAge, txtGender, txtAddress;
    private DefaultTableModel model;
    private JTable table;
    private JComboBox<String> comboGender;

	
   

    public QLSVView() {
        setTitle("CHƯƠNG TRÌNH QUẢN LÝ SINH VIÊN");
        setSize(900, 400);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);

        System.out.println("SUCCESSFUL CONNECTION!");
        
        
        // Tạo giao diện
        JPanel panel = new JPanel(new BorderLayout());
        JPanel inputPanel = new JPanel(new GridLayout(6, 2, 5, 5));
        JLabel lblID = new JLabel("Mã sinh viên:");
        JLabel lblName = new JLabel("Họ tên:");
        JLabel lblAge = new JLabel("Tuổi:");
        JLabel lblGender = new JLabel("Giới tính:");
        JLabel lblAddress = new JLabel("Địa chỉ:");

        txtID = new JTextField();
        txtName = new JTextField();
        txtAge = new JTextField();
        comboGender = new JComboBox<>(new String[]{"Nam", "Nữ", "Khác"});
        txtAddress = new JTextField();

        inputPanel.add(lblID);
        inputPanel.add(txtID);
        inputPanel.add(lblName);
        inputPanel.add(txtName);
        inputPanel.add(lblAge);
        inputPanel.add(txtAge);
        inputPanel.add(lblGender);
        inputPanel.add(comboGender);
        inputPanel.add(lblAddress);
        inputPanel.add(txtAddress);

        panel.add(inputPanel, BorderLayout.NORTH);

        // Tạo bảng với các cột mới
        model = new DefaultTableModel();
        model.setColumnIdentifiers(new String[]{"Mã SV", "Họ Tên", "Tuổi", "Giới Tính", "Địa Chỉ"});
        table = new JTable(model);
        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);

        
        
        // Tạo nút
        JPanel buttonPanel = new JPanel();
        JButton btnThem = new JButton("Thêm");
        JButton btnSua = new JButton("Sửa");
        JButton btnXoa = new JButton("Xóa");
        JButton btnThoat = new JButton("Thoát");
         // Điều chỉnh vị trí và kích thước
        

        buttonPanel.add(btnThem);
        buttonPanel.add(btnSua);
        buttonPanel.add(btnXoa);
        buttonPanel.add(btnThoat);
        panel.add(buttonPanel, BorderLayout.SOUTH);

        add(panel);

        // Xử lý sự kiện cho các nút
        btnThem.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            	try {
                    String id=txtID.getText();
                    String name=txtName.getText();
                    String age=txtAge.getText();
                    String gender = comboGender.getSelectedItem().toString();
                    String address = txtAddress.getText();
                    
                    if(!isAllAlphabet(id) && !containsDigit(name) && !isAllAlphabet(age)&& !containsDigit(address)){
                        Sinhvien sv=new Sinhvien(Integer.parseInt(id),name,Integer.parseInt(age),gender,address);
                        int result = SinhvienDAO.getInstance().insert(sv);
                    }
                    else {
                        JOptionPane.showMessageDialog(null, "Thêm sinh viên thất bại!");
                    }
                    loadData();
                    // int id=Integer.parseInt(txtID.getText());
                    // String name=txtName.getText();
                    // int age=Integer.parseInt(txtAge.getText());
                    // String gender = comboGender.getSelectedItem().toString();
                    // String address = txtAddress.getText();
                    // Sinhvien sv=new Sinhvien(id,name,age,gender,address);
                    // int result = SinhvienDAO.getInstance().insert(sv);
                    // if (result > 0) {
                    //     JOptionPane.showMessageDialog(null, "Thêm sinh viên thành công!");
                    // } else {
                    //     JOptionPane.showMessageDialog(null, "Thêm sinh viên thất bại!");
                    // }
                    // loadData();
                } catch (Exception ex) {
                    // TODO: handle exception
                    JOptionPane.showMessageDialog(null, "Nhập thông tin sai hoặc thiếu!");
                }
            }
        });

        btnSua.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                
            	try {
                    String id=txtID.getText();
                    String name=txtName.getText();
                    String age=txtAge.getText();
                    String gender = comboGender.getSelectedItem().toString();
                    String address = txtAddress.getText();
                    
                    if(!isAllAlphabet(id) && !containsDigit(name) && !isAllAlphabet(age)&& !containsDigit(address)){
                        Sinhvien sv=new Sinhvien(Integer.parseInt(id),name,Integer.parseInt(age),gender,address);
                        int result = SinhvienDAO.getInstance().update(sv);
                    }
                    else {
                    JOptionPane.showMessageDialog(null, "Sửa thất bại!");
                    }
                    loadData();
                } catch (Exception ex) {
                    // TODO: handle exception
                    JOptionPane.showMessageDialog(null, "Nhập thông tin sai hoặc thiếu!");
                }
            }
        });

        btnXoa.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
          	
            	try {
                    String id = JOptionPane.showInputDialog("Nhập ID sinh viên :");
                    Sinhvien sv=new Sinhvien(Integer.parseInt(id));
                    int result=SinhvienDAO.getInstance().delete(sv);
                    if (result > 0) {
                        JOptionPane.showMessageDialog(null, "Xóa thành công!");
                        
                    } else {
                        JOptionPane.showMessageDialog(null, "Xóa thất bại!");
                    }
                    loadData();

                } catch (Exception ex) {
                    // TODO: handle exception
                    JOptionPane.showMessageDialog(null, "Nhập thông tin sai hoặc thiếu!" );
                }
               
            }
        });
        btnThoat.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                QLSVView.this.dispose(); // Đóng cửa sổ hiện tại
                
            }
        });


        // Tải dữ liệu lên bảng
        loadData();
    }

    private void loadData() {
        model.setRowCount(0);
        try {
        	Connection conn =JDBCUtil.getConnection();
            String sql = "SELECT * FROM SinhVien";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getString("ID"),
                        rs.getString("Name"),
                        rs.getInt("Age"),
                        rs.getString("Gender"),
                        rs.getString("Address")
                });
            }
            JDBCUtil.closeConnetion(conn);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public boolean isAllAlphabet(String input) {
        for (char c : input.toCharArray()) {
            if (!Character.isLetter(c)) {
                return false; // Nếu có 1 ký tự không phải chữ cái thì trả về false
            }
        }
        return true; // Tất cả ký tự đều là chữ cái
    }
    public boolean containsDigit(String input) {
        for (char c : input.toCharArray()) {
            if (Character.isDigit(c)) {
                return true;
            }
        }
        return false;
    }
    
    


    public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					QLSVView frame = new QLSVView();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}
}