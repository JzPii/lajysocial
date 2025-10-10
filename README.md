# LajySocial - Tự động Tương tác Mạng xã hội

Công cụ social cho người vừa lười vừa anti social như mình nhưng vẫn phải social. Chạy hoàn toàn sạch. không backend không API. Đảm bảo clean không bao giờ lo bị ban. Twitter/X, Facebook, Instagram, LinkedIn và Reddit.

## 🌟 Tính năng

- **Tự động cuộn trang** với tốc độ ngẫu nhiên giống con người
- **Tự động thích bài viết** với tỷ lệ phần trăm có thể điều chỉnh
- **Tự động bình luận** với các câu trả lời tích cực và tỷ lệ tùy chỉnh
- **Tự động nhấp "Xem thêm"** để mở rộng nội dung bài viết
- **Tương tác tuần tự**: Xử lý từng bài viết một cách tự nhiên (cuộn → mở rộng → thích → bình luận)
- **Mô phỏng hành vi người thật**: Con trỏ chuột chuyển động mượt mà, độ trễ ngẫu nhiên, gõ từng ký tự
- **Tùy chỉnh xác suất**: Điều chỉnh tỷ lệ thích/bình luận để tránh tương tác với mọi bài viết
- **Thống kê phiên làm việc**: Theo dõi số bài viết đã xem, thích, bình luận

## 📥 Cài đặt (Dành cho người dùng không chuyên)

### Bước 1: Tải xuống tiện ích

1. Tải xuống toàn bộ thư mục này về máy tính
2. Giải nén (nếu ở dạng file ZIP) vào một thư mục bất kỳ
3. Nhớ vị trí thư mục này (ví dụ: `Downloads/ChromeExt`)

### Bước 2: Mở trang Tiện ích mở rộng của Chrome

**Cách 1 - Qua Menu:**
1. Mở trình duyệt Chrome
2. Nhấp vào **3 chấm dọc** ở góc trên bên phải
3. Di chuột vào **"Tiện ích mở rộng"**
4. Chọn **"Quản lý tiện ích mở rộng"**

**Cách 2 - Qua thanh địa chỉ:**
1. Mở trình duyệt Chrome
2. Gõ vào thanh địa chỉ: `chrome://extensions/`
3. Nhấn Enter

### Bước 3: Bật chế độ Developer (Nhà phát triển)

1. Ở trang Tiện ích mở rộng, tìm công tắc **"Chế độ nhà phát triển"** (Developer mode) ở góc trên bên phải
2. Nhấp vào công tắc để **BẬT** (màu xanh)

![Bật chế độ Developer]

### Bước 4: Tải tiện ích vào Chrome

1. Sau khi bật chế độ Developer, sẽ xuất hiện 3 nút mới
2. Nhấp vào nút **"Tải tiện ích đã giải nén"** (Load unpacked)
3. Một cửa sổ chọn thư mục sẽ hiện ra
4. Chọn thư mục chứa tiện ích (thư mục có file `manifest.json`)
5. Nhấp **"Chọn thư mục"** (Select Folder)

![Load unpacked]

### Bước 5: Xác nhận cài đặt thành công

1. Tiện ích **"LajySocial"** sẽ xuất hiện trong danh sách
2. Icon 🌊 sẽ hiển thị trên thanh công cụ của Chrome
3. Nếu không thấy icon, nhấp vào **icon puzzle** (hình mảnh ghép) và ghim tiện ích

![Extension installed]

## 🚀 Cách sử dụng

### Bước 1: Truy cập mạng xã hội

1. Mở một trong các trang web được hỗ trợ:
   - Twitter/X: https://twitter.com hoặc https://x.com
   - Facebook: https://www.facebook.com
   - Instagram: https://www.instagram.com
   - LinkedIn: https://www.linkedin.com
   - Reddit: https://www.reddit.com

2. Đăng nhập vào tài khoản của bạn (nếu chưa đăng nhập)

### Bước 2: Mở bảng điều khiển tiện ích

1. Nhấp vào **icon 🌊** của tiện ích trên thanh công cụ
2. Cửa sổ popup sẽ hiện ra với các tùy chọn

### Bước 3: Cấu hình cài đặt

**📜 Cuộn tự động:**
- **Tốc độ cuộn**: Kéo 2 thanh trượt để đặt thời gian giữa các lần cuộn (từ 1-30 giây)

**❤️ Tự động thích:**
- Bật công tắc **"Enable Auto Like"**
- **Like Delay**: Thời gian chờ sau khi thích (2-30 giây)
- **Like Probability**: Xác suất thích bài viết (0-100%)
  - 0% = Không bao giờ thích
  - 100% = Luôn thích mọi bài
  - 70% (mặc định) = Thích khoảng 7/10 bài viết

**💬 Tự động bình luận:**
- Bật công tắc **"Enable Auto Comments"**
- **Comment Delay**: Thời gian chờ sau khi bình luận (5-60 giây)
- **Comment Probability**: Xác suất bình luận (0-100%)
  - 0% = Không bao giờ bình luận
  - 100% = Luôn bình luận mọi bài
  - 30% (mặc định) = Bình luận khoảng 3/10 bài viết

**👁️ Mở rộng nội dung:**
- Bật công tắc **"Auto Click See More"**
- **Click Delay**: Thời gian giữa các lần nhấp (1-10 giây)

### Bước 4: Khởi động tiện ích

1. Sau khi cấu hình xong, nhấp nút **"Start Surfing"** (màu xanh lá)
2. Tiện ích sẽ bắt đầu hoạt động:
   - Tự động cuộn trang
   - Tìm bài viết chưa tương tác
   - Nhấp "Xem thêm" (nếu bật)
   - Thích bài viết (theo xác suất đã đặt)
   - Bình luận (theo xác suất đã đặt)
3. Bạn sẽ thấy con trỏ chuột **màu đỏ** di chuyển và thực hiện các thao tác
4. Thông báo sẽ hiện ở góc trên bên phải màn hình

### Bước 5: Dừng tiện ích

1. Nhấp vào icon tiện ích
2. Nhấp nút **"Stop"** (màu đỏ)
3. Thống kê phiên làm việc sẽ hiển thị trong console

## 🧪 Chức năng thử nghiệm

Trước khi sử dụng chính thức, bạn có thể kiểm tra từng tính năng:

**🔍 Test "See More"**: Tìm và làm nổi bật các nút "Xem thêm" trên trang

**❤️ Test "Like Post"**: Thử thích bài viết đầu tiên hiển thị

**💬 Test "Comment"**: Mở hộp bình luận và gõ văn bản (KHÔNG gửi đi)

*Lưu ý: Chức năng test an toàn và không thực sự gửi bình luận.*

## ⚙️ Cài đặt khuyên dùng

### Cho người mới bắt đầu:
```
Tốc độ cuộn: 3s - 6s
Auto Like: BẬT, 50%, Delay 5s
Auto Comment: TẮT
See More: BẬT, Delay 2s
```

### Cho tương tác vừa phải:
```
Tốc độ cuộn: 2s - 4s
Auto Like: BẬT, 70%, Delay 5s
Auto Comment: BẬT, 20%, Delay 10s
See More: BẬT, Delay 2s
```

### Cho tương tác mạnh:
```
Tốc độ cuộn: 2s - 3s
Auto Like: BẬT, 90%, Delay 3s
Auto Comment: BẬT, 40%, Delay 8s
See More: BẬT, Delay 1s
```

## 🔍 Xem nhật ký hoạt động (Console)

Để xem chi tiết hoạt động của tiện ích:

1. Nhấn phím **F12** (hoặc Ctrl+Shift+I trên Windows, Cmd+Option+I trên Mac)
2. Chọn tab **"Console"**
3. Bạn sẽ thấy:
   - Từng bước trong chu trình tương tác
   - Xác suất kiểm tra: `Roll: 45.3%, Threshold: 70%, Result: LIKE`
   - Số lượng bài viết đã xem, thích, bình luận
   - Các lỗi (nếu có)

## ⚠️ Lưu ý quan trọng

1. **Sử dụng có trách nhiệm**: Tiện ích này chỉ nên dùng cho mục đích cá nhân và thử nghiệm
2. **Tuân thủ điều khoản**: Việc tự động hóa có thể vi phạm điều khoản dịch vụ của một số nền tảng
3. **Không lạm dụng**: Đặt xác suất và độ trễ hợp lý để tránh bị phát hiện
4. **Giám sát**: Luôn theo dõi hoạt động của tiện ích khi chạy
5. **Rủi ro**: Tài khoản của bạn có thể bị hạn chế hoặc khóa nếu phát hiện hành vi bất thường

## 🐛 Gỡ lỗi

### Tiện ích không hoạt động:
- Kiểm tra xem bạn đã bật công tắc "Enable Auto Like" hoặc "Enable Auto Comment" chưa
- Làm mới trang (F5) và thử lại
- Mở Console (F12) để xem thông báo lỗi

### Không tìm thấy nút thích/bình luận:
- Mỗi nền tảng có cấu trúc khác nhau, một số bài viết có thể không có nút
- Sử dụng nút "Test Like" hoặc "Test Comment" để kiểm tra
- Kiểm tra Console để xem chi tiết

### Con trỏ di chuyển nhưng không nhấp:
- Một số nền tảng chặn tương tác tự động
- Thử tăng thời gian delay
- Làm mới trang và thử lại

## 🔄 Cập nhật tiện ích

Khi có phiên bản mới:

1. Tải xuống phiên bản mới
2. Vào `chrome://extensions/`
3. Nhấp nút **"Xóa"** ở tiện ích cũ
4. Làm theo hướng dẫn cài đặt từ Bước 4

## 📝 Gỡ cài đặt

1. Vào `chrome://extensions/`
2. Tìm tiện ích **"LajySocial"**
3. Nhấp nút **"Xóa"**
4. Xác nhận xóa

## 🙋 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra phần "Gỡ lỗi" ở trên
2. Xem Console (F12) để tìm thông báo lỗi
3. Thử tắt tiện ích, làm mới trang và bật lại

## 📄 Giấy phép

Tiện ích này được cung cấp "như nó vốn có" mà không có bất kỳ đảm bảo nào. Sử dụng có trách nhiệm và tự chịu rủi ro.

---

**Lưu ý**: Tiện ích này chỉ dành cho mục đích học tập và thử nghiệm. Người dùng phải tự chịu trách nhiệm về việc sử dụng tiện ích này.
