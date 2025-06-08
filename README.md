# 🏢 Hệ Thống Quản Lý Chung Cư

Dự án bài tập lớn môn **Kĩ thuật phần mềm** (IT4082). Hệ thống quản lý chung cư hỗ trợ quản lý nhân khẩu, tài khoản, khoản thu, tạm trú/tạm vắng, và các chức năng liên quan với giao diện thân thiện và API mạnh mẽ.

## 📑 Mô tả dự án

Hệ thống bao gồm hai thành phần chính:
- **Backend**: Được xây dựng bằng **Spring Boot** (Java) với **Gradle**, cung cấp các API RESTful để quản lý dữ liệu.
- **Frontend**: Sử dụng **React** + **TypeScript** và **Tailwind CSS** để hiển thị giao diện và tương tác với backend.

---

## 📁 Cấu trúc thư mục

```plaintext
/ktpm
├── JavaCode/         # Dự án Spring Boot (Backend)
│   ├── src/          # Mã nguồn backend
│   └── build.gradle  # File cấu hình Gradle
└── frontend/         # Dự án React (Frontend)
    ├── src/          # Mã nguồn frontend
    └── package.json  # File cấu hình npm
```

---

## 🚀 Tính năng chính

- **Quản lý nhân khẩu**: Quản lý thông tin hộ khẩu và cư dân.
- **Quản lý tài khoản**: Hỗ trợ các vai trò như admin, kế toán, cư dân.
- **Quản lý khoản thu**: Theo dõi các khoản thu và đợt thu.
- **Quản lý tạm trú/tạm vắng**: Ghi nhận và quản lý thông tin tạm trú, tạm vắng.
- **Tìm kiếm và phân trang**: Hỗ trợ tìm kiếm nhanh và phân trang dữ liệu.
- **Xác thực và phân quyền**: Sử dụng Spring Security và JWT để đảm bảo bảo mật và phân quyền theo vai trò.

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Java 17+**
- **Spring Boot**: Framework chính cho backend.
- **Spring Security + JWT**: Xác thực và phân quyền.
- **JPA/Hibernate**: Quản lý cơ sở dữ liệu.
- **PostgreSQL/MySQL**: Cơ sở dữ liệu quan hệ.
- **Gradle**: Công cụ quản lý build.

### Frontend
- **React + TypeScript**: Xây dựng giao diện người dùng.
- **Tailwind CSS**: Thiết kế giao diện responsive.
- **Axios**: Gửi yêu cầu HTTP đến backend.
- **React Router DOM**: Điều hướng trong ứng dụng.
- **React Icons**: Thư viện icon cho giao diện.

---

## ⚙️ Cài đặt và chạy ứng dụng

### Yêu cầu môi trường
- **Backend**:
  - Java 17+ (JDK)
  - Gradle 7.0+
  - MySQL/PostgreSQL (đã cài đặt và chạy)
- **Frontend**:
  - Node.js 16+ và npm
  - Trình duyệt (Chrome, Firefox, hoặc Edge)

### 1. Clone dự án

```bash
git clone https://github.com/maniahuv/Project-IT4082.git
cd ktpm
```

### 2. Cài đặt và chạy Backend

1. **Di chuyển vào thư mục backend**:
   ```bash
   cd JavaCode
   ```

2. **Cấu hình cơ sở dữ liệu**:
   - Chỉnh sửa file `src/main/resources/application.properties` hoặc `application.yml`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/it3180
     spring.datasource.username=root
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     jwt.secret=your-secret-key
     ```
   - Đảm bảo MySQL/PostgreSQL đang chạy và tạo database `it3180`.

3. **Chạy backend**:
   ```bash
   ./gradlew bootRun
   ```
   Backend sẽ chạy tại: `http://localhost:8080`.

### 3. Cài đặt và chạy Frontend

1. **Di chuyển vào thư mục frontend**:
   ```bash
   cd ../frontend
   ```

2. **Cài đặt các thư viện**:
   ```bash
   npm install
   ```

3. **Chạy frontend**:
   ```bash
   npm start
   ```
   Frontend sẽ chạy tại: `http://localhost:3000`.

### 4. Truy cập ứng dụng
- Mở trình duyệt và truy cập: `http://localhost:3000`.
- Đăng nhập bằng tài khoản mặc định (xem bên dưới).

### 5. Tài khoản mặc định
Hệ thống tự động tạo các tài khoản sau khi khởi động lần đầu:

| Tên đăng nhập | Mật khẩu | Vai trò       | Họ tên              |
|---------------|----------|---------------|---------------------|
| totruong1     | 123456   | Tổ Trưởng     | Nguyễn Văn Trưởng   |
| totruong2     | 123456   | Tổ Trưởng     | Phạm Minh Trưởng    |
| topho1        | 123456   | Tổ Phó        | Trần Thị Phó        |
| topho2        | 123456   | Tổ Phó        | Hoàng Thị Phó       |
| ketoan1       | 123456   | Kế Toán       | Lê Văn Toán         |
| ketoan2       | 123456   | Kế Toán       | Đỗ Thị Toán         |

---

## 🔄 API mẫu

Dưới đây là một số endpoint chính của backend:

| Phương thức | Endpoint                   | Mô tả                          |
|-------------|----------------------------|--------------------------------|
| `POST`      | `/api/auth/login`          | Đăng nhập, trả về token JWT    |
| `GET`       | `/api/nhankhau`            | Lấy danh sách nhân khẩu        |
| `POST`      | `/api/hokhau`              | Thêm hộ khẩu mới               |
| `PUT`       | `/api/khoanthu/{id}`       | Cập nhật thông tin khoản thu   |

**Ví dụ yêu cầu đăng nhập**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "totruong1", "password": "123456"}'
```

**Chi tiết API**:
- Nếu sử dụng Swagger, truy cập: `http://localhost:8080/swagger-ui.html` để xem tài liệu API đầy đủ.

---

## 🛡️ Triển khai Production

### Backend
1. **Build file JAR**:
   ```bash
   ./gradlew build
   ```
   File JAR sẽ nằm trong `JavaCode/build/libs/`.

2. **Chạy JAR**:
   ```bash
   java -jar build/libs/your-app-name.jar
   ```

3. **Cấu hình production**:
   - Sử dụng biến môi trường hoặc file `application-prod.yml` để cấu hình database và JWT secret.
   - Đảm bảo database được tối ưu hóa (sử dụng `ddl-auto=validate` thay vì `update`).

### Frontend
1. **Build ứng dụng**:
   ```bash
   npm run build
   ```

2. **Triển khai**:
   - Copy thư mục `build/` vào máy chủ web (VD: Nginx, Apache).
   - Cấu hình proxy để chuyển các yêu cầu API đến backend.

---

## ⚠️ Xử lý lỗi thường gặp

1. **Lỗi kết nối database**:
   - Kiểm tra URL, username, password trong `application.properties`.
   - Đảm bảo MySQL/PostgreSQL đang chạy.

2. **Lỗi CORS**:
   - Cấu hình CORS trong `JavaCode/src/main/java/config/CorsConfig.java`:
     ```java
     @Bean
     public CorsFilter corsFilter() {
         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
         CorsConfiguration config = new CorsConfiguration();
         config.addAllowedOrigin("http://localhost:3000");
         config.addAllowedMethod("*");
         config.addAllowedHeader("*");
         source.registerCorsConfiguration("/**", config);
         return new CorsFilter(source);
     }
     ```

3. **Lỗi 404 API**:
   - Kiểm tra endpoint trong backend và đảm bảo frontend gọi đúng URL.

---

## 📄 Giấy phép

Dự án được phát triển cho mục đích học tập. Có thể sử dụng, chỉnh sửa tự do theo **MIT License**.

---

## 👨‍💻 Tác giả

- **GitHub**: [nganhaaa](https://github.com/nganhaaa), [maniahuv](https://githup.com/maniahuv), [nguyenkieuoanh-20225899](https://githup.com/nguyenkieuoanh-20225899),[petekaresito](https://githup.com/petekaresito)
- Liên hệ: [Thêm email hoặc thông tin liên hệ nếu cần]

---

## 📝 Ghi chú

- Đảm bảo kiểm tra các cấu hình bảo mật (JWT secret, password database) trước khi triển khai production.
- Xem thêm tài liệu chi tiết trong thư mục `/docs` (nếu có).

---

