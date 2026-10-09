# 🎓 G-Scores 2024 - Backend REST API System

Hệ thống Backend API Tra cứu và Phân tích phổ điểm thi THPT 2024 từ dữ liệu hơn 1,06 triệu thí sinh. Được xây dựng với **Node.js, Express, TypeScript**, áp dụng chặt chẽ **Lập trình hướng đối tượng (OOP)**, **Repository Pattern**, và **Zod Form Validation**.

---

## 🚀 Tính năng chính (Features)

1. **Nạp dữ liệu lớn (Big Data Seeding)**:
   - Đọc và xử lý tập dữ liệu `diem_thi_thpt_2024.csv` (hơn **1.061.605 dòng**).
   - Tối ưu hóa lưu trữ với SQLite Transaction & Pre-computed Indexing, thời gian seed chỉ mất **~8 giây**.

2. **Tra cứu điểm thi theo Số báo danh (SBD)**:
   - Endpoint: `GET /api/scores/:sbd`
   - Trả về chi tiết điểm 9 môn thi, đánh giá 4 mức học lực, cùng tổng điểm các khối thi đại học (Khối A, A1, B, C, D).

3. **Báo cáo phân loại phổ điểm 4 mức (Score Distribution Report)**:
   - Endpoint: `GET /api/reports/score-levels`
   - Thống kê chi tiết theo từng môn học dựa trên 4 mức bắt buộc:
     - **Level 1 (Giỏi)**: `Score >= 8.0`
     - **Level 2 (Khá)**: `6.0 <= Score < 8.0`
     - **Level 3 (Trung bình)**: `4.0 <= Score < 6.0`
     - **Level 4 (Yếu)**: `Score < 4.0`

4. **Danh sách Top 10 thí sinh Khối A (Toán, Lý, Hóa)**:
   - Endpoint: `GET /api/reports/top10-group-a`
   - Xếp hạng 10 thí sinh có tổng điểm 3 môn Toán, Vật lý, Hóa học cao nhất Việt Nam năm 2024.

5. **Thống kê tổng quan hệ thống (Dashboard Summary)**:
   - Endpoint: `GET /api/reports/dashboard`
   - Cung cấp tổng số thí sinh, số lượt thi, điểm trung bình toàn quốc và thủ khoa Khối A.

---

## 🏛️ Kiến trúc OOP & Design Patterns

Hệ thống tuân thủ nghiêm ngặt các nguyên lý **SOLID** và lập trình hướng đối tượng **OOP**:

```
backend/src/
├── config/             # Cấu hình môi trường & DB connection
├── domain/             # Lớp Domain Model (OOP Entities & Abstractions)
│   └── entities/
│       ├── Subject.ts  # Abstract BaseSubject, MathSubject, SubjectFactory...
│       └── StudentScore.ts # Entity chứa logic tính điểm khối A, B, C, D...
├── dtos/               # Data Transfer Objects & Zod Validation Schemas
├── repositories/       # Repository Pattern (IScoreRepository, SqliteScoreRepository)
├── services/           # Service Layer chứa Business Logic
├── controllers/        # Express Controllers xử lý HTTP Requests
└── routes/             # Định tuyến API (Express Routers)
```

### Điểm nổi bật OOP:
- **Polymorphism & Inheritance**: `BaseSubject` định nghĩa giao ước chung, các lớp cụ thể (`MathSubject`, `LiteratureSubject`, `PhysicsSubject`, ...) kế thừa và triển khai phương thức `getPerformanceLevel()`.
- **Factory Pattern**: `SubjectFactory` khởi tạo và quản lý tập hợp môn học động.
- **Encapsulation**: Đóng gói công thức tính điểm khối A/A1/B/C/D trong class `StudentScore`.
- **Dependency Inversion (DIP)**: `ScoreService` phụ thuộc vào interface `IScoreRepository`, dễ dàng thay đổi giữa SQLite, PostgreSQL hoặc Supabase.

---

## 🛠️ Hướng dẫn Chạy ứng dụng (Quick Start)

### Yêu cầu hệ thống:
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

### Bước 1: Cài đặt phụ thuộc (Install Dependencies)
```bash
cd backend
npm install
```

### Bước 2: Nạp dữ liệu vào Database (Data Seeding)
Chạy lệnh seeder để chuyển dữ liệu từ file CSV vào Database:
```bash
npm run seed
```
> ⏱️ Thời gian thực thi: ~8 giây cho 1,06 triệu dòng dữ liệu.

### Bước 3: Khởi chạy Backend Server
Chạy ở chế độ Development (Hot reload):
```bash
npm run dev
```
Hoặc Build và chạy Production:
```bash
npm run build
npm start
```

Server sẽ khởi chạy tại: `http://localhost:5000`

---

## 🧪 Lệnh Kiểm thử (Run Automated Tests)

Để tự động kiểm thử toàn bộ 7 API endpoints và tính đúng đắn của logic:
```bash
npx tsx src/test_backend.ts
```

---

## 📑 Chi tiết danh sách API Endpoints

| Lệnh | Endpoint | Mô tả | Mẫu Request / Query |
|---|---|---|---|
| `GET` | `/health` | Kiểm tra trạng thái hoạt động server | `http://localhost:5000/health` |
| `GET` | `/api/scores/:sbd` | Tra cứu điểm theo Số báo danh | `http://localhost:5000/api/scores/01000001` |
| `GET` | `/api/reports/top10-group-a` | Danh sách Top 10 Khối A (Toán, Lý, Hóa) | `http://localhost:5000/api/reports/top10-group-a` |
| `GET` | `/api/reports/score-levels` | Phổ điểm 4 mức (>=8, 6-8, 4-6, <4) theo môn | `http://localhost:5000/api/reports/score-levels` |
| `GET` | `/api/reports/dashboard` | Thống kê tổng quan hệ thống | `http://localhost:5000/api/reports/dashboard` |

---

## 🐳 Triển khai với Docker (Docker Deployment)

Có thể khởi chạy nhanh backend qua Docker Compose:
```bash
docker-compose up --build -d
```
