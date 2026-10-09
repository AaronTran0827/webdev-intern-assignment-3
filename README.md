# 🎓 G-Scores 2024 - Hệ Thống Quản Lý & Phân Tích Phổ Điểm Thi THPT 2024

Hệ thống Full-stack (React Frontend + Node.js Express REST API Backend) Tra cứu, Quản lý và Phân tích phổ điểm thi THPT 2024 từ dữ liệu hơn **1,06 triệu thí sinh**. Được thiết kế và xây dựng theo chuẩn kiến trúc **Domain-Driven Design (DDD)**, **Lập trình hướng đối tượng (OOP)**, **Repository Pattern**, và **Zod Form Validation**.

---

## 🏗️ Công Nghệ Sử Dụng (Tech Stack)

### **Backend (`/backend`)**
- **Core**: Node.js, Express framework, TypeScript.
- **Database & ORM**: PostgreSQL (Supabase cloud / Local Postgres), Prisma ORM.
- **Architecture**: Domain-Driven Design (DDD), Repository Pattern, Factory Pattern, Polymorphism.
- **Validation & Security**: Zod Schemas, Rate Limiting (`express-rate-limit`), Helmet security headers.
- **Testing**: Jest (`ts-jest`).

### **Frontend (`/frontend`)**
- **Core**: React 18, TypeScript, Vite.
- **Styling**: Tailwind CSS, Lucide React Icons.
- **Routing & HTTP Client**: React Router DOM v7, Axios.
- **Charts & Visualization**: Chart.js, React-Chartjs-2.

---

## 📁 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
webdev-intern-assignment-3/
├── backend/                     # Node.js Express REST API Backend
│   ├── prisma/                  # Prisma Schema & Database Seeder
│   ├── src/
│   │   ├── modules/student/     # Student Module (Domain, Application, Infrastructure, Presentation)
│   │   ├── shared/              # Middlewares, Error Handlers, Core Utilities
│   │   ├── app.ts               # Express App Config
│   │   └── server.ts            # Server Entry Point
│   ├── tests/                   # Unit Tests & Manual Postman Excel Generator
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                    # React Vite Frontend SPA
    ├── src/
    │   ├── components/          # Reusable UI Components (Navbar, Layout, Badge, etc.)
        ├── features/students/   # Student Features (Dashboard, Student Table, Reports, Forms)
    │   ├── lib/                 # Axios Client Instance (`apiClient.ts`)
    │   ├── App.tsx              # Main React App & Router Config
    │   └── main.tsx             # React DOM Entry
    ├── package.json
    └── vite.config.ts
```

## 🚀 Hướng Dẫn Khởi Chạy Local Từng Bước (Quick Start Guide)

### **Bước 1: Clone Repository về máy**

Mở Terminal (Command Prompt / PowerShell / Bash) và chạy lệnh:

```bash
git clone <URL_REPOSITORY_CUA_BAN>
cd webdev-intern-assignment-3
```

---

### **Bước 2: Cấu hình và khởi chạy Backend (`/backend`)**

1. **Di chuyển vào thư mục backend và cài đặt thư viện**:
   ```bash
   cd backend
   npm install
   ```

2. **Tạo file cấu hình môi trường `.env`**:
   Tạo file `.env` tại thư mục `backend/` sau đó paste file env_backend.txt em có gửi đính kèm ở mail

3. **Đồng bộ Schema Database với Prisma**:
   ```bash
   # Sinh TypeScript types từ Prisma Schema
   npm run prisma:generate

   # Đồng bộ cấu trúc bảng vào Database
   npm run prisma:push
   ```

4. **Nạp dữ liệu ban đầu (Database Seeding - Không khuyến khích khi vẫn sử dụng db của em vì dữ liệu đã được em import sẵn)**:
   Nếu cần nạp dữ liệu hơn 1 triệu thí sinh từ file CSV vào Database:
   ```bash
   npm run prisma:seed
   ```

5. **Khởi chạy Backend Server ở chế độ Development**:
   ```bash
   npm run dev
   ```
   - Server Backend sẽ chạy tại: **`http://localhost:5000`**
   - Kiểm tra trạng thái Server (Health Check): **`http://localhost:5000/health`**

---

### **Bước 3: Cấu hình và khởi chạy Frontend (`/frontend`)**

1. **Mở một cửa sổ Terminal mới** và di chuyển tới thư mục `frontend`:
   ```bash
   cd webdev-intern-assignment-3/frontend
   npm install
   ```

2. **Tạo file cấu hình môi trường `.env`**:
   Tạo file `.env` tại thư mục `frontend/`  sau đó paste file env_frontend.txt em có gửi đính kèm ở mail

3. **Khởi chạy Frontend Dev Server**:
   ```bash
   npm run dev
   ```
   - Ứng dụng Web Frontend sẽ sẵn sàng tại: **`http://localhost:5173`**

---

## 🧪 Chạy Kiểm Thử Tự Động (Automated Testing)

### **Chạy Unit Tests cho Backend**:
Tại thư mục `backend/`:
```bash
cd backend
npm test
```
*Hệ thống sẽ thực thi toàn bộ 17 unit test kiểm tra Domain Models, Calculation Services, và Group Detection.*

---

## 📑 Danh Sách API Endpoints Chính

| Method | Endpoint | Mô Tả | Tham Số (Query / Body) |
|---|---|---|---|
| `GET` | `/health` | Kiểm tra trạng thái máy chủ | N/A |
| `GET` | `/api/students` | Lấy danh sách thí sinh phân trang | `page`, `limit`, `group`, `sortBy`, `sortOrder` |
| `GET` | `/api/students/:sbd` | Tra cứu chi tiết thí sinh theo SBD | `sbd` (URL parameter) |
| `GET` | `/api/students/group/natural` | Lấy danh sách thí sinh Khối Tự Nhiên | N/A |
| `GET` | `/api/students/group/social` | Lấy danh sách thí sinh Khối Xã Hội | N/A |
| `POST` | `/api/students` | Thêm mới 01 thí sinh | JSON Body (SBD, điểm các môn) |
| `PUT` | `/api/students/:sbd` | Cập nhật thông tin điểm thí sinh | JSON Body |
| `DELETE` | `/api/students/:sbd` | Xóa thí sinh khỏi hệ thống | `sbd` (URL parameter) |
| `GET` | `/api/reports/subjects` | Báo cáo phổ điểm 4 mức (Giỏi, Khá, TB, Yếu) | `subject` (mã môn tùy chọn) |
| `GET` | `/api/reports/top10` | Danh sách Top 10 thí sinh cao điểm nhất | `block` (`A00`, `A01`, `B00`, `C00`, `D01`) |

---

## 🛠️ Biên Dịch Cho Môi Trường Production (Production Build)

Khi cần đóng gói ứng dụng để triển khai:

1. **Build Backend**:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

---

✨ **Chúc anh/chị có một trải nghiệm kiểm thử và đánh giá website thật vui vẻ và thuận lợi!** ✨
