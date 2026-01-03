# E-Commerce Modern Platform

Nền tảng thương mại điện tử hiện đại được xây dựng với NestJS, React và Supabase.

## 🚀 Công nghệ sử dụng

- **Backend**: NestJS, Prisma ORM, PostgreSQL (Supabase), Passport JWT.
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Zustand, React Query.

## 🛠️ Hướng dẫn cài đặt

### 1. Backend

1. Di chuyển vào thư mục backend: `cd backend`
2. Cài đặt dependencies: `npm install`
3. Cấu hình tệp `.env`:
   - Sao chép `.env.example` (nếu có) hoặc tạo mới:
   ```env
   DB_PRISMA="your_supabase_connection_string"
   JWT_SECRET="your_secret_key"
   PORT=4000
   ```
4. Generate Prisma Client: `npx prisma generate`
5. Khởi tạo database: `npx prisma db push`
6. Chạy seed dữ liệu (Admin & Categories): `npx prisma db seed`
7. Khởi chạy: `npm run start:dev`

### 2. Frontend

1. Di chuyển vào thư mục frontend: `cd frontend`
2. Cài đặt dependencies: `npm install`
3. Khởi chạy: `npm run dev`

## 🔑 Tài khoản mặc định (sau khi seed)

- **Admin**: `admin@example.com` / `admin123`
- **User**: Tự đăng ký qua giao diện.

## ✨ Tính năng nổi bật

- Xác thực JWT & Phân quyền Admin/User.
- Quản lý sản phẩm, danh mục (CRUD).
- Giỏ hàng & Quy trình đặt hàng (Checkout).
- Giao diện Premium, Responsive hoàn toàn.
- Kiến trúc Modular dễ dàng mở rộng.
