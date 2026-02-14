# Kế hoạch Phát triển Ứng dụng Valentine (Matcha Meadow) 🍵�

## Tổng quan
Ứng dụng tương tác dạng "Story/Game" dành tặng người yêu dịp Valentine. Người chơi sẽ trải qua các giai đoạn (Phases) khác nhau, từ giới thiệu, trả lời câu hỏi, xem bài tarot, gacha quà tặng, đến đọc thư và gửi lời nhắn.

## Cấu trúc Giai đoạn (Phases)

1.  **Phase 1: Khai báo Danh tính (Input)** 📝
    *   Màn hình chào mừng.
    *   Nhập tên (nickname) để bắt đầu.
    *   *Thay đổi*: Đổi tiêu đề thành "Buổi tiệc trái tim" và theme Valentine.

2.  **Phase 2: Loading** ⏳
    *   Hiệu ứng tải trang dễ thương.

3.  **Phase 3: Giới thiệu (Intro)** 👋
    *   Chào mừng người chơi theo tên.
    *   Nút bắt đầu hành trình.

4.  **Phase 4: Quiz (Câu hỏi)** ❓
    *   Các câu hỏi vui về thấu hiểu nhau.

5.  **Phase 5: Tarot** 🔮
    *   Bói vui tình yêu.

6.  **Phase 6: Flip Card (Lật thẻ)** 🃏
    *   Game lật thẻ bài.

7.  **Phase 7: Gacha (Quay thưởng)** 🎁
    *   Quay quà ngẫu nhiên.

8.  **Phase 8: Battery (Pin tình yêu)** 🔋
    *   Nạp năng lượng tình yêu.

9.  **Phase 9: Mini Game** 🎮
    *   Trò chơi nhỏ tương tác.

10. **Phase 10: Star Map (Bản đồ sao)** ✨
    *   Kết nối các chòm sao.

11. **Phase 11: Timeline (Dòng thời gian)** 📅
    *   Kỷ niệm đáng nhớ.

12. **Phase 12: Letter (Bức thư)** 💌
    *   Đọc thư (Code hoặc Viết tay).
    *   Gửi điều ước/lời nhắn lại.

## Yêu cầu Chỉnh sửa (Cập nhật Mới)

### 1. Phase 1: Theme Valentine & Danh tính
*   **Tiêu đề**: Đổi "MeowMagic" thành "**Buổi tiệc trái tim**".
*   **Giao diện**: Thêm không khí Valentine (trái tim, màu hồng/đỏ nhẹ phối xanh).
*   **Nút bấm**: Đổi text nút thành "Tham gia tiệc".
*   **Input**: Placeholder "Nhập tên khách mời đặc biệt...".
*   **Mô tả**: Thêm dòng "Khai báo danh tính để vào tiệc".

### 2. Phần Viết Thư (Letter)
*   Kiểm tra lại tính năng gửi lời nhắn ở Phase 12.
*   Làm nổi bật phần phản hồi của người chơi.

### 3. Nút Cuối cùng
*   Đổi các nút điều hướng/replay cho phù hợp với theme "Buổi tiệc".

## 5 Ý tưởng Cải tiến (Đề xuất)

1.  **Bản đồ Kỷ niệm (Memory Map)** 🗺️: Thay vì chỉ timeline, hiển thị bản đồ các địa điểm đã đi qua cùng nhau với ảnh check-in.
2.  **Vòng quay Thử thách (Dare Wheel)** 🎡: Thêm minigame quay vào các ô "Hôn má", "Ôm 1 phút", "Mời đi ăn" để tăng tương tác thực tế.
3.  **Playlist Tình yêu (Love Jukebox)** 🎵: Cho phép người chơi chọn bài hát nền yêu thích trong lúc trải nghiệm ứng dụng.
4.  **Hộp "Open When..." (Mở khi...)** 📦: Các bức thư/quà tặng bị khóa, chỉ mở được vào đúng thời điểm (VD: Khi buồn, Khi nhớ anh, Valentine năm sau).
5.  **Chế độ "Duo" (Couple Mode)** 👩‍❤️‍👨: Hai người cùng online và tương tác thời gian thực (ví dụ: chạm vào màn hình cùng lúc để mở khóa trái tim).
