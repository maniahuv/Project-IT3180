package view;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import model.Teacher;
import dao.TeacherDAOImpl;

public class TeacherFrame extends JFrame {

    private JButton addButton, updateButton, deleteButton, listButton;
    private JTextArea textArea;
    private JTextField idTextField, nameTextField, ageTextField, genderTextField;

    public TeacherFrame() {
        setTitle("Quản lý Giảng viên");
        setSize(600, 400);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        // Các nút chức năng
        addButton = new JButton("Thêm Giảng viên");
        updateButton = new JButton("Sửa Giảng viên");
        deleteButton = new JButton("Xóa Giảng viên");
        listButton = new JButton("Danh sách Giảng viên");

        // Các trường nhập liệu
        idTextField = new JTextField(15);
        nameTextField = new JTextField(15);
        ageTextField = new JTextField(15);
        genderTextField = new JTextField(15);

        // Khu vực hiển thị danh sách giảng viên
        textArea = new JTextArea(10, 40);
        textArea.setEditable(false);

        // Bố cục
        JPanel inputPanel = new JPanel(new GridLayout(5, 2, 10, 10));
        inputPanel.add(new JLabel("ID Giảng viên:"));
        inputPanel.add(idTextField);
        inputPanel.add(new JLabel("Tên Giảng viên:"));
        inputPanel.add(nameTextField);
        inputPanel.add(new JLabel("Tuổi:"));
        inputPanel.add(ageTextField);
        inputPanel.add(new JLabel("Giới tính:"));
        inputPanel.add(genderTextField);

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(addButton);
        buttonPanel.add(updateButton);
        buttonPanel.add(deleteButton);
        buttonPanel.add(listButton);

        JPanel displayPanel = new JPanel();
        displayPanel.add(new JScrollPane(textArea));

        setLayout(new BorderLayout());
        add(inputPanel, BorderLayout.NORTH);
        add(buttonPanel, BorderLayout.CENTER);
        add(displayPanel, BorderLayout.SOUTH);

        // Sự kiện cho nút Thêm Giảng viên
        addButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                addTeacher();
            }
        });

        // Sự kiện cho nút Sửa Giảng viên
        updateButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                updateTeacher();
            }
        });

        // Sự kiện cho nút Xóa Giảng viên
        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                deleteTeacher();
            }
        });

        // Sự kiện cho nút Danh sách Giảng viên
        listButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                listTeachers();
            }
        });
    }

    private void addTeacher() {
        String id = idTextField.getText();
        String name = nameTextField.getText();
        int age = Integer.parseInt(ageTextField.getText());
        String gender = genderTextField.getText();
        Teacher teacher = new Teacher(id, name, age, gender);

        TeacherDAOImpl teacherDAO = new TeacherDAOImpl();
        teacherDAO.addTeacher(teacher);
        JOptionPane.showMessageDialog(this, "Thêm giảng viên thành công!");
        clearFields();
    }

    private void updateTeacher() {
        String id = idTextField.getText();
        String name = nameTextField.getText();
        int age = Integer.parseInt(ageTextField.getText());
        String gender = genderTextField.getText();
        Teacher teacher = new Teacher(id, name, age, gender);

        TeacherDAOImpl teacherDAO = new TeacherDAOImpl();
        teacherDAO.updateTeacher(teacher);
        JOptionPane.showMessageDialog(this, "Sửa giảng viên thành công!");
        clearFields();
    }

    private void deleteTeacher() {
        String id = idTextField.getText();
        TeacherDAOImpl teacherDAO = new TeacherDAOImpl();
        teacherDAO.deleteTeacher(id);
        JOptionPane.showMessageDialog(this, "Xóa giảng viên thành công!");
        clearFields();
    }

    private void listTeachers() {
        TeacherDAOImpl teacherDAO = new TeacherDAOImpl();
        textArea.setText(""); // Clear previous text
        for (Teacher teacher : teacherDAO.getAllTeachers()) {
            textArea.append(teacher.getIdTeacher() + " - " + teacher.getName() + " - " + teacher.getAge() + " - " + teacher.getGender() + "\n");
        }
    }

    private void clearFields() {
        idTextField.setText("");
        nameTextField.setText("");
        ageTextField.setText("");
        genderTextField.setText("");
    }

    public static void main(String[] args) {
        new TeacherFrame().setVisible(true);
    }
}
