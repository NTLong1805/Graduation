# Lễ Tốt Nghiệp 2026 — Thiệp Mời

Website lời mời tham dự lễ tốt nghiệp — HTML/CSS/JS thuần, không framework.

## Chạy thử

Mở thẳng `index.html` bằng trình duyệt — không cần build, không cần server
(phần gửi email qua `/api/send-email` sẽ hoạt động sau khi deploy, xem bên dưới).

## Chỉnh sửa nội dung — chỉ cần sửa một chỗ

Toàn bộ thông tin (tên, ngày giờ, địa điểm, link Google Maps, email nhận
phản hồi, lời mời, timeline, ảnh) nằm gọn trong object `CONFIG` ở đầu file
`js/script.js`. Sửa ở đó, không cần đụng vào HTML/CSS.

```js
const CONFIG = {
  graduateName: "Nguyễn Văn A",
  eventDateTimeISO: "2026-08-01T08:00:00",
  ...
};
```

## Ảnh thật

Bỏ ảnh của bạn vào `assets/images/` rồi liệt kê đường dẫn trong
`CONFIG.galleryImages` (trong `js/script.js`). Nếu để trống, gallery sẽ tự
hiển thị các ô trang trí gold/navy thay thế — trang vẫn chạy bình thường,
không bị vỡ layout, không dùng ảnh có watermark.

Ảnh minh hoạ ở Hero là SVG vẽ tay (mũ tốt nghiệp + bằng tốt nghiệp) nên
không cần file ảnh — bạn có thể thay bằng ảnh thật của mình nếu muốn (sửa
phần `.hero-visual` trong `index.html`).

## Bản đồ

`CONFIG.googleMapsUrl` là link mở Google Maps ở tab mới.
`CONFIG.googleMapsEmbedUrl` (tuỳ chọn) là link nhúng iframe bản đồ — nếu để
`null`, trang dùng embed mặc định trong `index.html` (sửa `src` của
`#mapEmbed` cho đúng địa điểm của bạn).

## Gửi email khi có người RSVP

`api/send-email.js` là một Vercel Serverless Function tối giản, không dùng
database — chỉ nhận dữ liệu form và gửi email cho bạn qua Resend
(https://resend.com, có gói miễn phí).

Deploy lên Vercel rồi thêm 3 biến môi trường:

```
RESEND_API_KEY   = API key từ Resend
OWNER_EMAIL      = email bạn muốn nhận RSVP
FROM_EMAIL       = địa chỉ "from" đã verify trên Resend
```

Muốn dùng provider khác (SendGrid, Postmark, SMTP...) chỉ cần sửa hàm
`sendEmail()` trong file đó — phần frontend không cần đổi gì.

## Cấu trúc

```
graduation-invitation/
├── index.html
├── css/style.css
├── js/script.js
├── assets/images/   ← bỏ ảnh thật vào đây
├── assets/icons/
└── api/send-email.js
```
# Graduation
