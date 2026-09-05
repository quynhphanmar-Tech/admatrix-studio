import {
  ScriptVariant,
  GenerationConfig,
  PhaseType,
  ScriptPhase,
  FootageTag,
  ARCHETYPE_LABELS
} from '@/types/core';

function createPhase(
  phaseType: PhaseType,
  label: string,
  startSec: number,
  durationSec: number,
  spokenText: string,
  visualDescription: string,
  textOverlay: string,
  cameraWork: string,
  emotionBeat: string,
  requiredFootageTag: FootageTag
): ScriptPhase {
  return {
    phaseType,
    label,
    startSec,
    endSec: startSec + durationSec,
    durationSec,
    spokenText,
    visualDescription,
    textOverlay,
    cameraWork,
    emotionBeat,
    requiredFootageTag,
  };
}

export function generate12Scripts(config: GenerationConfig): ScriptVariant[] {
  const { productName, productBenefit } = config;

  return [
    {
      id: 'script_01',
      index: 1,
      archetype: 'PAIN_POINT_EMOTIONAL',
      label: ARCHETYPE_LABELS.PAIN_POINT_EMOTIONAL.vi,
      hookStrategy: 'Chạm vào nỗi đau khó chịu nhất',
      storyArc: 'Đau khổ -> Tình cờ phát hiện -> Dùng thử -> Hạnh phúc',
      proofType: 'Cảm xúc cá nhân',
      ctaMechanism: 'Tạo sự khan hiếm',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Mở đầu (Nỗi đau)', 0, 5, 'Có phải bạn đang ám ảnh vì vấn đề này mỗi ngày?', 'Người dùng lộ vẻ mệt mỏi, bất lực', 'ÁM ẢNH MỖI NGÀY?', 'Cận cảnh mặt, zoom nhanh', 'Thất vọng, mệt mỏi', 'PERSON_FRUSTRATED'),
        createPhase('PROBLEM', 'Khai thác nỗi đau', 5, 5, 'Làm mọi cách nhưng vẫn không đỡ, thật sự rất nản.', 'Góc quay ngang, cúi đầu thở dài', 'LÀM ĐỦ CÁCH VẪN KHÔNG ĐỠ', 'Đứng yên, hơi rung', 'Bế tắc', 'PERSON_FRUSTRATED'),
        createPhase('TURNING', 'Điểm ngoặt', 10, 5, `Cho đến khi mình vô tình thấy ${productName}.`, 'Cầm sản phẩm lên xem với vẻ tò mò', `MAY MÀ TÌM ĐƯỢC ${productName}`, 'Theo dõi tay cầm sản phẩm', 'Tò mò', 'PRODUCT_HERO'),
        createPhase('DEMO', 'Sử dụng', 15, 6, 'Chỉ cần dùng như thế này, cảm giác rất dễ chịu.', 'Đang dùng sản phẩm một cách dễ dàng', 'DỄ SỬ DỤNG - THOẢI MÁI', 'Góc quay POV tay cầm', 'Thư giãn', 'PRODUCT_IN_USE'),
        createPhase('RESULT', 'Kết quả', 21, 5, `Hiệu quả rõ rệt luôn, ${productBenefit} cực tốt.`, 'Cười tươi, tự tin', 'HIỆU QUẢ RÕ RỆT', 'Zoom out nhẹ', 'Hạnh phúc', 'PERSON_HAPPY'),
        createPhase('CTA', 'Kêu gọi hành động', 26, 4, 'Đang có deal hời số lượng có hạn, chốt ngay đi!', 'Chỉ tay xuống dưới, hiện icon giỏ hàng', 'MUA NGAY KẺO LỠ', 'Đứng yên', 'Gấp rút', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Có phải bạn đang ám ảnh vì vấn đề này mỗi ngày? Làm mọi cách nhưng vẫn không đỡ, thật sự rất nản. Cho đến khi mình vô tình thấy ${productName}. Chỉ cần dùng như thế này, cảm giác rất dễ chịu. Hiệu quả rõ rệt luôn, ${productBenefit} cực tốt. Đang có deal hời số lượng có hạn, chốt ngay đi!`,
      caption: `Đừng để nỗi đau làm phiền bạn nữa! Dùng ${productName} ngay hôm nay để ${productBenefit} 💥 #AdMatrix #${productName} #ShopeeHaul #Review`,
      hashtags: ['#AdMatrix', `#${productName.replace(/\s+/g, '')}`, '#Review', '#ShopeeHaul', '#DealHot'],
      estimatedCTR: 'HIGH'
    },
    {
      id: 'script_02',
      index: 2,
      archetype: 'STAT_SHOCK_RATIONAL',
      label: ARCHETYPE_LABELS.STAT_SHOCK_RATIONAL.vi,
      hookStrategy: 'Dùng con số gây sốc',
      storyArc: 'Fact -> Giải thích -> Giải pháp -> Dữ liệu -> Mua',
      proofType: 'Số liệu logic',
      ctaMechanism: 'Nhấn mạnh giá trị',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Thống kê sốc', 0, 5, '90% mọi người đều mắc sai lầm này khiến tình trạng tồi tệ hơn.', 'Đưa ra biểu đồ hoặc con số to trên màn hình', '90% ĐANG MẮC SAI LẦM', 'Zoom in nhanh vào text', 'Ngạc nhiên', 'PERSON_FRUSTRATED'),
        createPhase('EXPLAIN', 'Giải thích', 5, 5, 'Lý do là vì chúng ta dùng sai phương pháp.', 'Người lắc đầu giải thích', 'VÌ SAO LẠI THẾ?', 'Cố định', 'Nghiêm túc', 'EXPERT_AUTHORITY'),
        createPhase('PRODUCT', 'Giới thiệu sản phẩm', 10, 5, `Giải pháp khoa học chính là ${productName}.`, 'Sản phẩm xuất hiện thật đẹp', 'GIẢI PHÁP ĐÂY RỒI', 'Quay vòng quanh sản phẩm', 'Tin tưởng', 'PRODUCT_HERO'),
        createPhase('MECHANISM', 'Cơ chế hoạt động', 15, 6, `Nó giúp ${productBenefit} từ sâu bên trong.`, 'Animation hoặc chất liệu sản phẩm', 'TÁC ĐỘNG SÂU', 'Macro zoom', 'Ấn tượng', 'TEXTURE_MACRO'),
        createPhase('DATA', 'Dữ liệu chứng minh', 21, 5, 'Thực tế chứng minh hiệu quả chỉ sau 1 tuần.', 'Ảnh before/after với số liệu', 'HIỆU QUẢ SAU 7 NGÀY', 'Pan ngang', 'Thuyết phục', 'BEFORE_AFTER'),
        createPhase('CTA', 'Kêu gọi', 26, 4, 'Đầu tư cho bản thân không bao giờ lỗ. Nhấn vào đây!', 'Sản phẩm bên cạnh giỏ hàng', 'GIÁ TRỊ XỨNG ĐÁNG', 'Zoom in nhẹ', 'Chắc chắn', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `90% mọi người đều mắc sai lầm này khiến tình trạng tồi tệ hơn. Lý do là vì chúng ta dùng sai phương pháp. Giải pháp khoa học chính là ${productName}. Nó giúp ${productBenefit} từ sâu bên trong. Thực tế chứng minh hiệu quả chỉ sau 1 tuần. Đầu tư cho bản thân không bao giờ lỗ. Nhấn vào đây!`,
      caption: `Góc sự thật: Dùng ${productName} giúp bạn ${productBenefit} một cách khoa học 🧬 #AdMatrix #${productName}`,
      hashtags: ['#KienThuc', '#KhoaHoc', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'MEDIUM'
    },
    {
      id: 'script_03',
      index: 3,
      archetype: 'COMMENT_REPLY_SOCIAL',
      label: ARCHETYPE_LABELS.COMMENT_REPLY_SOCIAL.vi,
      hookStrategy: 'Trực tiếp trả lời comment người dùng',
      storyArc: 'Đọc comment -> Trả lời -> Phô diễn -> Bằng chứng -> Kêu gọi',
      proofType: 'Social Proof',
      ctaMechanism: 'Dùng thử',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Đọc comment', 0, 5, 'Có bạn bảo: "Dùng mấy cái này vô thưởng vô phạt."', 'Chỉ tay vào comment trên màn hình', 'VÔ THƯỞNG VÔ PHẠT?', 'Cầm điện thoại quay selfie', 'Thách thức', 'PERSON_HAPPY'),
        createPhase('ANSWER', 'Trả lời trực diện', 5, 5, `Để mình chứng minh cho bạn thấy với ${productName}.`, 'Nhếch mép cười, cầm sản phẩm', 'ĐỂ MÌNH CHỨNG MINH', 'Tiến lại gần camera', 'Tự tin', 'PRODUCT_HERO'),
        createPhase('DEMO', 'Demo thực tế', 10, 8, `Nhìn kỹ nhé, chỉ cần apply lên là thấy ngay sự khác biệt.`, 'Thực hiện động tác sử dụng sản phẩm rõ ràng', 'NHÌN KỸ SỰ KHÁC BIỆT', 'Cận cảnh tay và sản phẩm', 'Tập trung', 'PRODUCT_IN_USE'),
        createPhase('PROOF', 'Bằng chứng', 18, 5, `Rất nhiều người đã khen tính năng ${productBenefit} của nó rồi.`, 'Lướt các feedback, review', 'HÀNG NGÀN REVIEW TỐT', 'Góc quay màn hình', 'Tự hào', 'UGC_TESTIMONIAL'),
        createPhase('RESULT', 'Thành quả', 23, 4, 'Chất lượng thế này mà bảo vô thưởng vô phạt sao?', 'Cười mãn nguyện với kết quả', 'CHẤT LƯỢNG ĐỈNH CAO', 'Quay góc đẹp', 'Vui vẻ', 'PERSON_HAPPY'),
        createPhase('CTA', 'Kêu gọi', 27, 3, 'Không tin thì tự mình trải nghiệm thử xem!', 'Chỉ giỏ hàng', 'TRẢI NGHIỆM NGAY', 'Đứng yên', 'Thuyết phục', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Có bạn bảo: "Dùng mấy cái này vô thưởng vô phạt." Để mình chứng minh cho bạn thấy với ${productName}. Nhìn kỹ nhé, chỉ cần apply lên là thấy ngay sự khác biệt. Rất nhiều người đã khen tính năng ${productBenefit} của nó rồi. Chất lượng thế này mà bảo vô thưởng vô phạt sao? Không tin thì tự mình trải nghiệm thử xem!`,
      caption: `Trả lời thắc mắc của mọi người về ${productName} đây! ${productBenefit} cực xịn nha 😎 #AdMatrix #${productName}`,
      hashtags: ['#TraLoiComment', '#ReviewChanThuc', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'HIGH'
    },
    {
      id: 'script_04',
      index: 4,
      archetype: 'BEFORE_AFTER_TRANSFORM',
      label: ARCHETYPE_LABELS.BEFORE_AFTER_TRANSFORM.vi,
      hookStrategy: 'Khoe ảnh before thảm họa',
      storyArc: 'Before -> Nỗi đau -> Solution -> Process -> After -> CTA',
      proofType: 'Thực tế Transform',
      ctaMechanism: 'Chốt Deal',
      totalDurationSec: 32,
      phases: [
        createPhase('HOOK', 'Tình trạng cũ', 0, 5, 'Nhìn tình trạng thảm họa này của mình trước đây xem.', 'Hình ảnh tồi tệ trước khi dùng', 'THẢM HỌA LÀ ĐÂY', 'Zoom chậm vào chi tiết xấu', 'Xấu hổ', 'BEFORE_AFTER'),
        createPhase('CONTRAST', 'Xoáy sâu', 5, 5, 'Lúc đó mình cực kỳ tự ti, không dám ra đường.', 'Lắc đầu ngán ngẩm', 'CỰC KỲ TỰ TI', 'Góc tối', 'Buồn bã', 'PERSON_FRUSTRATED'),
        createPhase('PRODUCT', 'Giải pháp', 10, 5, `Nhờ có ${productName} cứu rỗi cuộc đời mình.`, 'Sản phẩm lóe sáng xuất hiện', 'CỨU TINH XUẤT HIỆN', 'Pan từ dưới lên', 'Hy vọng', 'PRODUCT_HERO'),
        createPhase('PROCESS', 'Quá trình', 15, 6, `Mỗi ngày mình chăm chỉ dùng để ${productBenefit}.`, 'Các bước sử dụng liên tục', 'CHĂM CHỈ MỖI NGÀY', 'Fast cut', 'Chăm chỉ', 'PRODUCT_IN_USE'),
        createPhase('AFTER', 'Kết quả mới', 21, 6, 'Và boom! Nhìn thành quả hiện tại của mình này.', 'Hình ảnh after lộng lẫy, so sánh 2 bên', 'KẾT QUẢ ĐÂY NÈ', 'Slide ngang so sánh', 'Tự hào', 'BEFORE_AFTER'),
        createPhase('CTA', 'Kêu gọi', 27, 5, 'Muốn lột xác như mình thì săn deal ngay góc trái nha!', 'Chỉ tay góc trái, nháy mắt', 'LỘT XÁC NGAY - SĂN DEAL', 'Cố định', 'Vui vẻ', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Nhìn tình trạng thảm họa này của mình trước đây xem. Lúc đó mình cực kỳ tự ti, không dám ra đường. Nhờ có ${productName} cứu rỗi cuộc đời mình. Mỗi ngày mình chăm chỉ dùng để ${productBenefit}. Và boom! Nhìn thành quả hiện tại của mình này. Muốn lột xác như mình thì săn deal ngay góc trái nha!`,
      caption: `Biến hình ngoạn mục nhờ ${productName}! Tạm biệt nỗi lo cũ, chào đón ${productBenefit} ✨ #AdMatrix #BeforeAfter`,
      hashtags: ['#BeforeAfter', '#GlowUp', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'HIGH'
    },
    {
      id: 'script_05',
      index: 5,
      archetype: 'TUTORIAL_HOWTO',
      label: ARCHETYPE_LABELS.TUTORIAL_HOWTO.vi,
      hookStrategy: 'Đặt câu hỏi cách làm',
      storyArc: 'Câu hỏi -> Bước 1 -> Bước 2 -> Bước 3 -> Kết quả -> Link',
      proofType: 'Hướng dẫn chi tiết',
      ctaMechanism: 'Truy cập link',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Câu hỏi', 0, 4, `Làm sao để ${productBenefit} đúng cách nhất?`, 'Nhún vai hỏi, text to', 'LÀM SAO ĐỂ ĐÚNG CÁCH?', 'Selfie', 'Tò mò', 'PERSON_HAPPY'),
        createPhase('STEP_1', 'Unbox', 4, 5, `Cùng unbox ${productName} và bắt đầu nhé.`, 'Mở hộp sản phẩm, lấy ra', 'BƯỚC 1: UNBOX', 'Cận cảnh tay mở hộp', 'Hào hứng', 'HANDS_UNBOX'),
        createPhase('STEP_2', 'Apply', 9, 6, 'Bước tiếp theo, lấy một lượng vừa đủ và thoa đều.', 'Thao tác xịt/bôi/sử dụng sản phẩm', 'BƯỚC 2: APPLY', 'Góc nghiêng cận', 'Tập trung', 'PRODUCT_IN_USE'),
        createPhase('STEP_3', 'Chờ đợi', 15, 5, 'Massage nhẹ nhàng và chờ khoảng 5 phút.', 'Tay xoa hoặc chờ đợi', 'BƯỚC 3: MASSAGE & ĐỢI', 'Zoom out chậm', 'Thư giãn', 'LIFESTYLE_AMBIENT'),
        createPhase('RESULT', 'Thành quả', 20, 5, 'Ta-da! Cảm giác cực kỳ fresh và sạch sẽ.', 'Khoe vùng vừa sử dụng xong', 'KẾT QUẢ CỰC FRESH', 'Cận cảnh thành quả', 'Vui vẻ', 'PERSON_HAPPY'),
        createPhase('CTA', 'Kêu gọi', 25, 5, 'Làm theo hướng dẫn và mua ở link này để tránh hàng fake nhé.', 'Chỉ xuống link bio/giỏ hàng', 'MUA CHÍNH HÃNG Ở ĐÂY', 'Đứng yên', 'Nhắc nhở', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Làm sao để ${productBenefit} đúng cách nhất? Cùng unbox ${productName} và bắt đầu nhé. Bước tiếp theo, lấy một lượng vừa đủ và thoa đều. Massage nhẹ nhàng và chờ khoảng 5 phút. Ta-da! Cảm giác cực kỳ fresh và sạch sẽ. Làm theo hướng dẫn và mua ở link này để tránh hàng fake nhé.`,
      caption: `Lưu ngay bí kíp dùng ${productName} chuẩn không cần chỉnh để ${productBenefit} 📌 #AdMatrix #Tutorial`,
      hashtags: ['#HuongDan', '#Tips', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'MEDIUM'
    },
    {
      id: 'script_06',
      index: 6,
      archetype: 'POV_DAY_IN_LIFE',
      label: ARCHETYPE_LABELS.POV_DAY_IN_LIFE.vi,
      hookStrategy: 'Góc nhìn người trong cuộc',
      storyArc: 'POV -> Sáng -> Vấn đề -> Giải pháp -> Tối -> CTA',
      proofType: 'Thực tế đời sống',
      ctaMechanism: 'Nâng tầm phong cách',
      totalDurationSec: 32,
      phases: [
        createPhase('HOOK', 'POV Text', 0, 4, '', 'Góc nhìn POV mở mắt thức dậy', 'POV: MỘT NGÀY CỦA MÌNH', 'POV rung nhẹ', 'Tự nhiên', 'LIFESTYLE_AMBIENT'),
        createPhase('MORNING', 'Thói quen sáng', 4, 5, 'Mỗi buổi sáng thức dậy, việc đầu tiên là vệ sinh cá nhân.', 'POV đi vào nhà tắm hoặc chuẩn bị', 'CHÀO BUỔI SÁNG', 'Walking', 'Ngái ngủ', 'LIFESTYLE_AMBIENT'),
        createPhase('PROBLEM', 'Gặp rắc rối', 9, 6, 'Nhưng luôn bị bực mình vì tình trạng khó chịu này.', 'POV nhìn thấy một rắc rối, lắc đầu', 'LẠI LÀ VẤN ĐỀ NÀY', 'Zoom nhanh vào rắc rối', 'Bực dọc', 'PERSON_FRUSTRATED'),
        createPhase('SOLUTION', 'Xử lý', 15, 7, `Thủ sẵn ${productName} để ${productBenefit} ngay tức thì.`, 'POV cầm sản phẩm ra xài', 'BẢO BỐI GIẢI CỨU', 'POV tay cầm sản phẩm', 'Hài lòng', 'PRODUCT_IN_USE'),
        createPhase('EVENING', 'Kết ngày', 22, 5, 'Tối về thấy mọi thứ vẫn hoàn hảo, thoải mái cực kỳ.', 'POV nằm dài thư giãn', 'KẾT THÚC NGÀY HOÀN HẢO', 'Pan nhẹ nhàng', 'Thoải mái', 'PERSON_HAPPY'),
        createPhase('CTA', 'Kêu gọi', 27, 5, 'Nâng tầm cuộc sống của bạn ngay hôm nay, thử liền nhé!', 'Giơ sản phẩm lên trước background chill', 'NÂNG TẦM CUỘC SỐNG - MUA NGAY', 'Cố định', 'Thuyết phục', 'PRODUCT_HERO')
      ],
      voiceoverScript: `Mỗi buổi sáng thức dậy, việc đầu tiên là vệ sinh cá nhân. Nhưng luôn bị bực mình vì tình trạng khó chịu này. Thủ sẵn ${productName} để ${productBenefit} ngay tức thì. Tối về thấy mọi thứ vẫn hoàn hảo, thoải mái cực kỳ. Nâng tầm cuộc sống của bạn ngay hôm nay, thử liền nhé!`,
      caption: `POV: Cách mình đối phó với rắc rối mỗi ngày nhờ ${productName} 🌿 ${productBenefit} #AdMatrix #Vlog`,
      hashtags: ['#DayInMyLife', '#POV', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'MEDIUM'
    },
    {
      id: 'script_07',
      index: 7,
      archetype: 'EXPERT_AUTHORITY',
      label: ARCHETYPE_LABELS.EXPERT_AUTHORITY.vi,
      hookStrategy: 'Khoe bằng cấp/sự chuyên nghiệp',
      storyArc: 'Chuyên gia -> Chẩn đoán -> Khuyên dùng -> Cách dùng -> Đảm bảo -> CTA',
      proofType: 'Authority',
      ctaMechanism: 'Chuyên gia khuyên',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Khoe uy tín', 0, 5, 'Với 5 năm kinh nghiệm, tôi khuyên bạn nên dừng thói quen này lại.', 'Mặc áo blouse hoặc đồ chuyên nghiệp', 'CHUYÊN GIA KHUYÊN BẠN', 'Trung cảnh', 'Nghiêm túc', 'EXPERT_AUTHORITY'),
        createPhase('EXPLAIN', 'Phân tích', 5, 6, 'Theo khoa học, cấu trúc của nó rất dễ bị tổn thương nếu làm sai.', 'Có bảng hoặc minh họa y khoa/kỹ thuật', 'CẤU TRÚC BỊ TỔN THƯƠNG', 'Zoom in vào minh họa', 'Học thuật', 'TEXTURE_MACRO'),
        createPhase('RECOMMEND', 'Khuyên dùng', 11, 5, `Tôi luôn kê cho khách hàng dùng ${productName}.`, 'Cầm sản phẩm giơ ngang vai', 'SẢN PHẨM KHUYÊN DÙNG', 'Focus sản phẩm', 'Tin cậy', 'PRODUCT_HERO'),
        createPhase('DEMO', 'Demo chuẩn', 16, 5, `Giúp ${productBenefit} an toàn và hiệu quả nhất.`, 'Hướng dẫn khách hàng hoặc mô hình', 'CÁCH SỬ DỤNG CHUẨN', 'Góc nghiêng', 'Chuyên nghiệp', 'PRODUCT_IN_USE'),
        createPhase('GUARANTEE', 'Bảo chứng', 21, 5, 'Được kiểm định chất lượng nghiêm ngặt nên hoàn toàn yên tâm.', 'Hiện icon chứng nhận', 'ĐÃ KIỂM ĐỊNH', 'Pop-up nhanh', 'Chắc chắn', 'PRODUCT_PACKSHOT'),
        createPhase('CTA', 'Kêu gọi', 26, 4, 'Bấm vào góc trái để bảo vệ sức khỏe của bạn.', 'Chỉ tay chuyên nghiệp', 'BẢO VỆ BẢN THÂN - MUA NGAY', 'Cố định', 'Quan tâm', 'EXPERT_AUTHORITY')
      ],
      voiceoverScript: `Với 5 năm kinh nghiệm, tôi khuyên bạn nên dừng thói quen này lại. Theo khoa học, cấu trúc của nó rất dễ bị tổn thương nếu làm sai. Tôi luôn kê cho khách hàng dùng ${productName}. Giúp ${productBenefit} an toàn và hiệu quả nhất. Được kiểm định chất lượng nghiêm ngặt nên hoàn toàn yên tâm. Bấm vào góc trái để bảo vệ sức khỏe của bạn.`,
      caption: `Nghe lời khuyên từ chuyên gia về ${productName} giúp bạn ${productBenefit} an toàn 👨‍⚕️ #AdMatrix #Expert`,
      hashtags: ['#ChuyenGiaKhuyenDung', '#KienThuc', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'HIGH'
    },
    {
      id: 'script_08',
      index: 8,
      archetype: 'INGREDIENT_DEEPDIVE',
      label: ARCHETYPE_LABELS.INGREDIENT_DEEPDIVE.vi,
      hookStrategy: 'Quay cận cảnh quyến rũ',
      storyArc: 'Macro -> Cơ chế -> So sánh -> ASMR -> Kết quả -> Mua',
      proofType: 'Thành phần nổi bật',
      ctaMechanism: 'Chất lượng cao',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Cận cảnh texture', 0, 4, 'Bạn đã bao giờ nhìn kỹ chất liệu của siêu phẩm này chưa?', 'Quay macro chất kem/vải/nước của sản phẩm', 'NHÌN KỸ CHẤT LIỆU NÀY', 'Macro pan chậm', 'Mê mẩn', 'TEXTURE_MACRO'),
        createPhase('SCIENCE', 'Công dụng', 4, 6, `${productName} có thành phần đặc biệt giúp ${productBenefit}.`, 'Hiển thị lá cây/nguyên liệu tự nhiên', 'THÀNH PHẦN ĐẶC BIỆT', 'Zoom vào nguyên liệu', 'Tự nhiên', 'NATURE_INGREDIENT'),
        createPhase('COMPARE', 'So sánh', 10, 5, 'Khác biệt hoàn toàn so với các loại đại trà trên thị trường.', 'Chia đôi màn hình, 1 bên xịn 1 bên dỏm', 'KHÁC BIỆT HOÀN TOÀN', 'Split screen', 'Tự tin', 'BEFORE_AFTER'),
        createPhase('DEMO', 'ASMR', 15, 6, 'Nghe thử âm thanh khi sử dụng này, đã cực kỳ!', 'Đang xoa/chạm phát ra tiếng', 'ASMR - ÂM THANH CỰC ĐÃ', 'Góc cận cảnh', 'Thư giãn', 'PRODUCT_IN_USE'),
        createPhase('RESULT', 'Thành quả', 21, 5, 'Mang lại một trải nghiệm cao cấp và vô cùng hiệu quả.', 'Khoe lớp finish hoặc hiệu ứng', 'TRẢI NGHIỆM CAO CẤP', 'Xoay nhẹ', 'Hài lòng', 'PERSON_HAPPY'),
        createPhase('CTA', 'Kêu gọi', 26, 4, 'Chất lượng xịn thế này, bấm mua luôn đi!', 'Cận cảnh packaging', 'CHỐT ĐƠN HÀNG XỊN', 'Focus', 'Quyết đoán', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Bạn đã bao giờ nhìn kỹ chất liệu của siêu phẩm này chưa? ${productName} có thành phần đặc biệt giúp ${productBenefit}. Khác biệt hoàn toàn so với các loại đại trà trên thị trường. Nghe thử âm thanh khi sử dụng này, đã cực kỳ! Mang lại một trải nghiệm cao cấp và vô cùng hiệu quả. Chất lượng xịn thế này, bấm mua luôn đi!`,
      caption: `Zoom cận cảnh sự thật về ${productName} - Bí quyết để ${productBenefit} 🔍 #AdMatrix #ASMR`,
      hashtags: ['#ASMR', '#ThanhPhan', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'MEDIUM'
    },
    {
      id: 'script_09',
      index: 9,
      archetype: 'UGC_MASHUP',
      label: ARCHETYPE_LABELS.UGC_MASHUP.vi,
      hookStrategy: 'Cắt ghép nhiều clip giật gân',
      storyArc: 'Tease -> User1 -> User2 -> User3 -> Tổng hợp -> CTA',
      proofType: 'Số đông người dùng',
      ctaMechanism: 'Hiệu ứng bầy đàn',
      totalDurationSec: 28,
      phases: [
        createPhase('HOOK', 'Tổng hợp sốc', 0, 4, 'Đây là lý do cả cõi mạng đang rần rần săn lùng em nó.', 'Clip fast cut nhiều người đang trầm trồ', 'CẢ MẠNG RẦN RẦN', 'Giật liên tục', 'Sôi động', 'UGC_TESTIMONIAL'),
        createPhase('USER1', 'Review 1', 4, 4, '"Trời ơi tui hối hận vì không biết sớm hơn!"', 'Một bạn nữ đang khen ngợi', 'HỐI HẬN VÌ KHÔNG BIẾT SỚM', 'Selfie vlog', 'Bất ngờ', 'PERSON_HAPPY'),
        createPhase('USER2', 'Review 2', 8, 4, `"${productName} thực sự giúp tui ${productBenefit} á."`, 'Người khác đang dùng sản phẩm', 'CÔNG NHẬN HIỆU QUẢ', 'Góc nghiêng', 'Khẳng định', 'PRODUCT_IN_USE'),
        createPhase('USER3', 'Review 3', 12, 4, '"Mười điểm không có nhưng nha mọi người ơi."', 'Người thứ 3 giơ ngón tay cái', '10 ĐIỂM KHÔNG CÓ NHƯNG', 'Selfie', 'Vui vẻ', 'PERSON_HAPPY'),
        createPhase('COMPILATION', 'Montage', 16, 7, 'Ai cũng mê tít rồi, bạn còn đợi đến bao giờ nữa?', 'Cắt ghép nhiều video ngắn thành grid', 'BẠN CÒN ĐỢI GÌ?', 'Grid view', 'Dồn dập', 'UGC_TESTIMONIAL'),
        createPhase('CTA', 'Kêu gọi', 23, 5, 'Gia nhập hội những người thông thái ngay góc trái!', 'Giỏ hàng bự', 'GIA NHẬP NGAY CÙNG MỌI NGƯỜI', 'Pop-up to', 'Gấp rút', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Đây là lý do cả cõi mạng đang rần rần săn lùng em nó. "Trời ơi tui hối hận vì không biết sớm hơn!" "${productName} thực sự giúp tui ${productBenefit} á." "Mười điểm không có nhưng nha mọi người ơi." Ai cũng mê tít rồi, bạn còn đợi đến bao giờ nữa? Gia nhập hội những người thông thái ngay góc trái!`,
      caption: `Tổng hợp rần rần review về ${productName}! Ai cũng công nhận khả năng ${productBenefit} cực đỉnh 🔥 #AdMatrix #Review`,
      hashtags: ['#Trending', '#ReviewTiktok', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'HIGH'
    },
    {
      id: 'script_10',
      index: 10,
      archetype: 'SCARCITY_FOMO',
      label: ARCHETYPE_LABELS.SCARCITY_FOMO.vi,
      hookStrategy: 'Tạo cảm giác sắp hết',
      storyArc: 'Đồng hồ đếm ngược -> Độ hot -> Demo lẹ -> Kho hàng mỏng -> Quà -> CTA',
      proofType: 'Hàng hiếm',
      ctaMechanism: 'Fomo',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Khẩn cấp', 0, 5, 'Cảnh báo! Deal sốc này sẽ bốc hơi trong 24h nữa.', 'Màn hình đỏ, đồng hồ đếm ngược', 'CẢNH BÁO: DEAL SẮP HẾT', 'Rung màn hình', 'Gấp gáp', 'PRODUCT_HERO'),
        createPhase('PROOF', 'Độ hot', 5, 5, `Không phải tự nhiên mà ${productName} cứ về là cháy hàng.`, 'Đóng gói hàng loạt hoặc kho hàng', 'CỨ VỀ LÀ CHÁY HÀNG', 'Pan nhanh qua các hộp hàng', 'Náo nhiệt', 'HANDS_UNBOX'),
        createPhase('DEMO', 'Dùng thử nhanh', 10, 5, `Nó giúp ${productBenefit} siêu nhanh gọn nhẹ.`, 'Thao tác xài cực lẹ x2 speed', 'SIÊU NHANH GỌN NHẸ', 'Fast forward', 'Chớp nhoáng', 'PRODUCT_IN_USE'),
        createPhase('STOCK', 'Số lượng có hạn', 15, 5, 'Hiện tại kho chỉ còn đúng 50 suất cuối cùng thôi.', 'Chỉ vào màn hình tồn kho', 'CHỈ CÒN 50 SUẤT', 'Zoom vào số', 'Tiếc nuối', 'PRODUCT_PACKSHOT'),
        createPhase('BONUS', 'Tặng quà', 20, 5, 'Mà lại còn được tặng kèm phần quà độc quyền này.', 'Khoe quà tặng', 'TẶNG QUÀ ĐỘC QUYỀN', 'Đẩy quà lên trước ống kính', 'Hấp dẫn', 'PRODUCT_HERO'),
        createPhase('CTA', 'Kêu gọi', 25, 5, 'Ai nhanh tay thì được, chốt lẹ kẻo tiếc hùi hụi!', 'Chỉ cuống cuồng xuống giỏ', 'CHỐT LẸ - SẮP HẾT HÀNG', 'Rung nhẹ', 'Khẩn thiết', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Cảnh báo! Deal sốc này sẽ bốc hơi trong 24h nữa. Không phải tự nhiên mà ${productName} cứ về là cháy hàng. Nó giúp ${productBenefit} siêu nhanh gọn nhẹ. Hiện tại kho chỉ còn đúng 50 suất cuối cùng thôi. Mà lại còn được tặng kèm phần quà độc quyền này. Ai nhanh tay thì được, chốt lẹ kẻo tiếc hùi hụi!`,
      caption: `Gấp gấp!! Tồn kho ${productName} sắp cạn! Cơ hội cuối để ${productBenefit} giá hời 🏃‍♂️💨 #AdMatrix #SaleSậpSàn`,
      hashtags: ['#SaleSoc', '#ChayHang', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'HIGH'
    },
    {
      id: 'script_11',
      index: 11,
      archetype: 'VALUE_STACK',
      label: ARCHETYPE_LABELS.VALUE_STACK.vi,
      hookStrategy: 'Thả neo giá trị',
      storyArc: 'Giá sốc -> Món 1 -> Món 2 -> Món 3 -> Tổng kết -> Mua combo',
      proofType: 'Toán học hời',
      ctaMechanism: 'Chốt lời',
      totalDurationSec: 30,
      phases: [
        createPhase('HOOK', 'Neo giá', 0, 4, 'Cầm 500 cành thì mua được gì? Để mình chỉ cho một combo siêu hời.', 'Xòe tiền hoặc vuốt cằm', '500K THÌ MUA ĐƯỢC GÌ?', 'Selfie góc rộng', 'Tò mò', 'PERSON_HAPPY'),
        createPhase('ITEM1', 'Món chính', 4, 5, `Đầu tiên là một em ${productName} xịn xò để ${productBenefit}.`, 'Đặt sản phẩm chính xuống bàn mạnh mẽ', 'SẢN PHẨM CHÍNH XỊN XÒ', 'Zoom vào sản phẩm', 'Hào hứng', 'PRODUCT_HERO'),
        createPhase('ITEM2', 'Món 2', 9, 5, 'Chưa hết đâu, tặng thêm một món phụ đỉnh của chóp.', 'Đặt tiếp món số 2 xuống', 'TẶNG THÊM MÓN PHỤ', 'Pan ngang', 'Thích thú', 'PRODUCT_PACKSHOT'),
        createPhase('ITEM3', 'Món 3', 14, 5, 'Và bonus thêm chiếc túi cực xinh này nữa, quá đã!', 'Khoe túi/quà tặng', 'BONUS QUÀ CỰC XINH', 'Đẩy tới gần', 'Bất ngờ', 'HANDS_UNBOX'),
        createPhase('TOTAL', 'Tổng hợp', 19, 6, 'Tính ra mua một mà được tận ba, tiết kiệm gần phân nửa giá gốc.', 'Giăng cả 3 món ra, hiện giá gạch chéo', 'MUA 1 ĐƯỢC 3 - TIẾT KIỆM KHỦNG', 'Góc từ trên xuống', 'Tính toán', 'PRODUCT_HERO'),
        createPhase('CTA', 'Kêu gọi', 25, 5, 'Deal combo này chỉ có ở phiên live/link này, vợt liền!', 'Gõ vào màn hình', 'VỢT LIỀN DEAL COMBO', 'Lắc nhẹ', 'Dứt khoát', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Cầm 500 cành thì mua được gì? Để mình chỉ cho một combo siêu hời. Đầu tiên là một em ${productName} xịn xò để ${productBenefit}. Chưa hết đâu, tặng thêm một món phụ đỉnh của chóp. Và bonus thêm chiếc túi cực xinh này nữa, quá đã! Tính ra mua một mà được tận ba, tiết kiệm gần phân nửa giá gốc. Deal combo này chỉ có ở phiên live/link này, vợt liền!`,
      caption: `Siêu hời! Combo ${productName} giúp bạn ${productBenefit} mà giá lại rẻ giật mình 💸 #AdMatrix #DealHoi`,
      hashtags: ['#MuaSam', '#Unbox', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'MEDIUM'
    },
    {
      id: 'script_12',
      index: 12,
      archetype: 'CHALLENGE_DARE',
      label: ARCHETYPE_LABELS.CHALLENGE_DARE.vi,
      hookStrategy: 'Đưa ra thách thức',
      storyArc: 'Thách thức -> Bắt đầu -> Ngày 1 -> Ngày 7 -> Lột xác -> CTA',
      proofType: 'Nhật ký',
      ctaMechanism: 'Chấp nhận thử thách',
      totalDurationSec: 32,
      phases: [
        createPhase('HOOK', 'Thách thức', 0, 5, 'Bạn có dám thử thách 7 ngày lột xác cùng mình không?', 'Chỉ tay vào camera, ánh mắt kiên định', 'THỬ THÁCH 7 NGÀY LỘT XÁC', 'Góc hất từ dưới lên', 'Thách thức', 'PERSON_HAPPY'),
        createPhase('SETUP', 'Luật chơi', 5, 5, `Luật chơi đơn giản: Chỉ dùng duy nhất ${productName} mỗi ngày.`, 'Giơ 1 ngón tay, tay kia cầm sản phẩm', 'CHỈ DÙNG DUY NHẤT SẢN PHẨM NÀY', 'Trung cảnh', 'Nghiêm túc', 'PRODUCT_HERO'),
        createPhase('DAY1', 'Ngày 1', 10, 5, 'Ngày đầu tiên, cảm giác apply lên cực kỳ dễ chịu.', 'Hình ảnh ngày 1, đang xài', 'DAY 1: BẮT ĐẦU', 'Cận cảnh tay', 'Trải nghiệm', 'PRODUCT_IN_USE'),
        createPhase('DAY7', 'Ngày 7', 15, 6, `Tới ngày thứ 7, nó thực sự giúp ${productBenefit} đáng kinh ngạc.`, 'Nhật ký tua nhanh các ngày', 'DAY 7: ĐÁNG KINH NGẠC', 'Fast forward dựng phim', 'Bất ngờ', 'BEFORE_AFTER'),
        createPhase('REVEAL', 'Lột xác', 21, 6, 'Sự khác biệt là quá rõ ràng, mình hoàn toàn bị thuyết phục.', 'So sánh ngày 1 và ngày 7', 'SỰ KHÁC BIỆT RÕ RÀNG', 'Slide wipe', 'Tự hào', 'BEFORE_AFTER'),
        createPhase('CTA', 'Kêu gọi', 27, 5, 'Ai chấp nhận thử thách thì quất ngay ở giỏ hàng nha!', 'Giơ tay như high five', 'CHẤP NHẬN THỬ THÁCH - MUA NGAY', 'Đẩy tay vào ống kính', 'Hào hứng', 'PRODUCT_PACKSHOT')
      ],
      voiceoverScript: `Bạn có dám thử thách 7 ngày lột xác cùng mình không? Luật chơi đơn giản: Chỉ dùng duy nhất ${productName} mỗi ngày. Ngày đầu tiên, cảm giác apply lên cực kỳ dễ chịu. Tới ngày thứ 7, nó thực sự giúp ${productBenefit} đáng kinh ngạc. Sự khác biệt là quá rõ ràng, mình hoàn toàn bị thuyết phục. Ai chấp nhận thử thách thì quất ngay ở giỏ hàng nha!`,
      caption: `Thử thách 7 ngày cùng ${productName} để xem khả năng ${productBenefit} có như lời đồn? 💪 #AdMatrix #Challenge`,
      hashtags: ['#ThuThach7Ngay', '#ThayDoiBanThan', `#${productName.replace(/\s+/g, '')}`],
      estimatedCTR: 'HIGH'
    }
  ];
}
