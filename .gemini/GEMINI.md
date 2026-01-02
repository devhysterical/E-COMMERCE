# Project Documentation: E-Commerce Modern Platform

## 1. Giới thiệu dự án

Dự án xây dựng nền tảng thương mại điện tử hiện đại, tối ưu hóa hiệu suất và trải nghiệm người dùng. Hệ thống tập trung vào tính bảo mật, khả năng mở rộng và quản lý dữ liệu chặt chẽ thông qua kiến trúc Modular.

## 2. Công nghệ sử dụng (Tech Stack)

- Frontend
  **Framework**: React.js (Vite)
  **CSS Framework**: Tailwind CSS
  **Quản lý trạng thái**: React Query (Server state) & Zustand (Client state)
  **Ngôn ngữ**: TypeScript

- Backend
  **Framework**: NestJS
  **ORM**: Prisma
  **Ngôn ngữ**: TypeScript

- Database & Cloud
  **Hệ quản trị CSDL**: PostgreSQL (thông qua Supabase)
  **Xác thực**: Supabase Auth
  **Lưu trữ tệp**: Supabase Storage

## 3. Chức năng chính (Core Features)

- Khách hàng (User)
  **Đăng ký, đăng nhập và quản lý hồ sơ cá nhân**
  **Duyệt danh sách sản phẩm, lọc theo danh mục và tìm kiếm**
  **Xem chi tiết sản phẩm và các đánh giá liên quan**
  **Quản lý giỏ hàng (thêm, sửa số lượng, xóa sản phẩm)**
  **Thực hiện đặt hàng và theo dõi trạng thái đơn hàng**

- Quản trị viên (Admin)
  **Dashboard thống kê doanh thu và chỉ số tăng trưởng**
  **Quản lý sản phẩm (CRUD), danh mục và số lượng tồn kho**
  **Quản lý người dùng và trạng thái đơn hàng**

## 4. Quy tắc ràng buộc & Tiêu chuẩn phát triển

- Quy tắc chung (General Rules)
  **Ngôn ngữ**: Luôn luôn sử dụng tiếng Việt trong tất cả phản hồi và tài liệu hướng dẫn liên quan đến dự án này.
  **Tuân thủ**: Tuyệt đối tuân thủ nội dung trong các file hướng dẫn đã ghi.
  **Phong cách**: Không chèn icon hoặc emoji bừa bãi trong văn bản và mã nguồn.

- Quy tắc dữ liệu (Database Rules)
  **Tính toàn vẹn**: Sử dụng Foreign Key cho tất cả các mối quan hệ giữa các bảng.
  **Xử lý xóa**: Sử dụng Soft Delete (cột deleted_at) cho các dữ liệu quan trọng như sản phẩm và đơn hàng.
  **Định dạng tiền tệ**: Lưu trữ dưới dạng số nguyên (Integer) để tránh sai số (Ví dụ: 50000 thay vì 50.0).

- Quy tắc Backend (NestJS)
  **Phân chia logic theo cấu trúc Module (Module, Controller, Service).**
  **Sử dụng DTO và Class-validator để kiểm soát dữ liệu đầu vào.**
  **Sử dụng TypeScript Strict Mode, tuyệt đối không sử dụng kiểu any.**

- Quy tắc Frontend (React)
  **Áp dụng Atomic Design cho các Component.**
  **Đảm bảo tính Responsive hoàn toàn trên các thiết bị Mobile, Tablet và Desktop.**
  **Mọi dữ liệu từ API phải có Interface/Type rõ ràng.**

## 5. Lộ trình thực hiện

- Thiết kế Schema Database và thiết lập dự án (Base Setup).
- Xây dựng Module Authentication và User.
- Phát triển Module Product và Category.
- Xử lý logic Giỏ hàng và Đơn hàng.
- Tích hợp thanh toán và hoàn thiện giao diện Admin.
