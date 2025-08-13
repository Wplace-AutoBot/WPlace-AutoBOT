# Test Save/Load Progress Feature

## Các tính năng đã thêm:

### Auto-Image.js:
1. **Save Progress** - Nút lưu tiến độ thủ công
2. **Load Progress** - Nút khôi phục tiến độ 
3. **Auto Save** - Tự động lưu mỗi 50 pixels và khi dừng
4. **Smart UI Restore** - Khôi phục UI đúng trạng thái trước khi dừng
5. **Progress Notification** - Thông báo khi khởi động nếu có progress đã lưu

### Cách sử dụng:

1. **Upload ảnh và chọn vị trí** như bình thường
2. **Bắt đầu painting** - script sẽ tự động lưu tiến độ
3. **Dừng script** khi cần - tiến độ sẽ được lưu tự động
4. **Khởi động lại script** - sẽ có thông báo nếu có tiến độ đã lưu
5. **Click "Load Progress"** để tiếp tục từ vị trí đã dừng
6. **UI sẽ hiển thị** đúng trạng thái như trước khi dừng (progress bar, pixels painted, vị trí, etc.)

### Dữ liệu được lưu:
- Thông tin ảnh và pixels
- Vị trí hiện tại trong painting
- Số pixels đã paint
- Map các pixels đã paint (để tránh paint lại)
- Vị trí bắt đầu và region
- Màu sắc available
- Ngôn ngữ đã chọn

### Auto Save:
- Mỗi 50 pixels được paint
- Khi user dừng script (Stop button)
- Clear progress khi hoàn thành painting

### Thông báo:
- Tiếng Việt và English support
- Hiển thị thời gian lưu và tiến độ
- Xác nhận trước khi load
