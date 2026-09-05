# AdMatrix v2 — Commercial Creative Hub & Video Ads Matrix Generator

![AdMatrix](https://img.shields.io/badge/AdMatrix-v2.0%20Final-fe2c55)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

**AdMatrix v2** là nền tảng tự động hóa sản xuất Video Ads chuyển đổi cao cho E-commerce, tối ưu thử nghiệm A/B và scale ngân sách quảng cáo:
1. **Bóc tách video viral gốc** (TikTok Top Ads / Douyin) thành 6 phase có timestamp, góc quay, nhịp cảm xúc và yêu cầu footage.
2. **Nhân bản ma trận 12 kịch bản độc lập** với 12 Archetypes có mạch dẫn chuyện và storyboard riêng biệt (không chỉ đổi text).
3. **Quản lý kho Footage đa nguồn**: Hỗ trợ upload video/ảnh sản phẩm tự quay, tự động phân loại bằng AI Vision (`FootageTag`), tích hợp kho Stock footage miễn phí bản quyền (Pexels Stock API).
4. **Bộ dựng Canvas MP4 HD**: Ghép timeline nhiều clip, hiệu ứng Ken Burns, nhúng TikTok Comment-Reply sticker và xuất **100% video thực tế định dạng .mp4**.
5. **Bảng phân tích hiệu suất A/B Test**: Tự động tính toán CTR, CVR, CPA, ROAS và đề xuất kịch bản Winner để scale ngân sách.

---

## 🚀 Hướng Dẫn Chạy & Deploy

### 1. Chạy trên Localhost (Production Server)
```bash
git clone https://github.com/quynhphanmar-Tech/admatrix-studio.git
cd admatrix-studio
npm install
npm run build
npm run start
```
Mở trình duyệt truy cập: **`http://localhost:3000`**

### 2. Triển khai 1-Click lên Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/new).
2. Kết nối kho lưu trữ GitHub: **`quynhphanmar-Tech/admatrix-studio`**.
3. Thêm các biến môi trường (Environment Variables) trong tab **Settings -> Environment Variables**:
   - `GEMINI_API_KEY`: Key Google Gemini của bạn
   - `PEXELS_API_KEY`: Key Pexels (lấy miễn phí tại pexels.com/api)
   - `RAPIDAPI_KEY`: Key RapidAPI TikTok (tuỳ chọn)
4. Bấm **Deploy**. Vercel sẽ tự động build và cấp domain live chính thức.

---

## 🔐 Tài Khoản Quản Trị Mặc Định (Backend Owner)
- **Email:** `quynhphan.mar@gmail.com`
- **Quyền hạn:** `ADMIN (Backend Owner)`
- **Cơ chế:** **Passless Direct Auth** (Đăng nhập tự động không cần pass ban đầu). Có thể thay đổi email hoặc cấu hình mật khẩu cứng bất kỳ lúc nào qua menu Header.
