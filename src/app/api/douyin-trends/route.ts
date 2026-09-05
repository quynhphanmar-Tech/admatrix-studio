export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'COSMETICS';

    const mockDb: Record<string, any[]> = {
      COSMETICS: [
        { titleZh: '沉浸式护肤日常', titleVi: 'Quy trình skincare chìm đắm (ASMR)', author: '@美妆小仙女', localizedHook: 'Skincare chữa lành buổi tối' },
        { titleZh: '一分钟出门妆容教学', titleVi: 'Dạy makeup ra khỏi nhà trong 1 phút', author: '@化装师KK', localizedHook: 'Makeup 1 phút đi làm vội' },
        { titleZh: '被问爆的口红试色', titleVi: 'Test màu son bị hỏi nổ inbox', author: '@李佳琦Austin', localizedHook: 'Màu son ai nhìn cũng phải hỏi' },
        { titleZh: '原相机无滤镜粉底测评', titleVi: 'Review kem nền camera thường không filter', author: '@真实测评', localizedHook: 'Test kem nền camera thường cam thường' },
        { titleZh: '有效抗老护肤秘籍', titleVi: 'Bí kíp skincare chống lão hóa hiệu quả', author: '@护肤博士', localizedHook: 'Bí quyết trẻ ra 10 tuổi' },
        { titleZh: '素颜霜伪素颜神仙打架', titleVi: 'Cuộc chiến kem tone-up giả mặt mộc', author: '@素颜女神', localizedHook: 'Cách có mặt mộc đẹp không tì vết' },
      ],
      PET_SUPPLIES: [
        { titleZh: '戏精小猫咪日常', titleVi: 'Thường ngày của bé mèo diễn viên', author: '@猫咪大院', localizedHook: 'Khi hoàng thượng diễn nét suy' },
        { titleZh: '沉浸式给修勾洗澡', titleVi: 'ASMR tắm cho cún cưng', author: '@汪星人', localizedHook: 'Tắm cho cún cưng thư giãn' },
        { titleZh: '铲屎官的进阶好物', titleVi: 'Bảo bối thần thánh cho con sen', author: '@宠物用品测评', localizedHook: 'Đồ dùng nuôi mèo nhàn tênh' },
        { titleZh: '小狗辅食制作教程', titleVi: 'Hướng dẫn làm pate tự chế cho cún', author: '@神仙主理人', localizedHook: 'Tự làm pate cho boss' },
        { titleZh: '如何挑对猫粮', titleVi: 'Làm sao để chọn đúng hạt cho mèo', author: '@兽医小明', localizedHook: 'Cách chọn hạt mèo không bị sỏi thận' },
        { titleZh: '小猫拆家现场', titleVi: 'Hiện trường mèo phá nhà', author: '@哈士奇本奇', localizedHook: 'Khi bạn vắng nhà 5 phút' },
      ],
      EDUCATION: [
        { titleZh: '清华学霸的作息表', titleVi: 'Lịch trình của học bá Thanh Hoa', author: '@清华小哥哥', localizedHook: 'Cách học 14 tiếng không mệt' },
        { titleZh: '每天十分钟练出好英语', titleVi: '10 phút mỗi ngày để giỏi tiếng Anh', author: '@英语达人', localizedHook: 'Bí kíp giỏi tiếng Anh không cần học nhiều' },
        { titleZh: '这三个习惯让你拉开差距', titleVi: '3 thói quen giúp bạn bứt phá', author: '@成长笔记', localizedHook: 'Thói quen của người thành công' },
        { titleZh: '干货满满的考研上岸经验', titleVi: 'Kinh nghiệm thi đỗ cao học (nhiều kiến thức)', author: '@学姐说', localizedHook: 'Bí quyết ôn thi đậu 100%' },
        { titleZh: '一招搞定拖延症', titleVi: '1 chiêu trị dứt điểm bệnh trì hoãn', author: '@心理学家', localizedHook: 'Cách ngừng bấm điện thoại và học bài' },
        { titleZh: '自律让我自由', titleVi: 'Kỷ luật mang lại tự do', author: '@极简生活', localizedHook: 'Ngày của người siêu kỷ luật' },
      ],
      FASHION: [
        { titleZh: '微胖女孩穿搭图鉴', titleVi: 'Cẩm nang phối đồ cho người mũm mĩm', author: '@微胖星人', localizedHook: 'Phối đồ hack dáng 5kg' },
        { titleZh: '秋季胶囊衣橱', titleVi: 'Tủ đồ nhộng mùa thu (Capsule Wardrobe)', author: '@穿搭日记', localizedHook: 'Chỉ 5 món đồ phối 30 ngày' },
        { titleZh: '男朋友改造计划', titleVi: 'Kế hoạch lột xác bạn trai', author: '@时尚达人', localizedHook: 'Biến bạn trai thành soái ca' },
        { titleZh: '小个子显高穿搭', titleVi: 'Phối đồ hack chiều cao cho nấm lùn', author: '@一米五日常', localizedHook: 'Cách cao thêm 10cm không cần giày' },
        { titleZh: '平价高质感好物分享', titleVi: 'Chia sẻ đồ rẻ mà sang', author: '@省钱小能手', localizedHook: 'Đồ local brand rẻ như cho' },
        { titleZh: '职场通勤穿搭OOTD', titleVi: 'OOTD đi làm chốn công sở', author: '@职场丽人', localizedHook: 'Mặc gì đi làm thứ 2?' },
      ],
      TECH: [
        { titleZh: '数码宅的桌面改造', titleVi: 'Cải tạo góc bàn làm việc của dân nghiện công nghệ', author: '@数码狂人', localizedHook: 'Setup góc máy 100 củ' },
        { titleZh: '百元平价耳机天花板', titleVi: 'Đỉnh cao tai nghe giá rẻ vài trăm tệ', author: '@耳机测评', localizedHook: 'Tai nghe 200k đập chết 2 củ' },
        { titleZh: '苹果隐藏功能大全', titleVi: 'Tổng hợp tính năng ẩn của iPhone', author: '@果粉集中营', localizedHook: '99% người dùng iPhone không biết điều này' },
        { titleZh: '学生党平价平板推荐', titleVi: 'Gợi ý máy tính bảng giá rẻ cho sinh viên', author: '@校园数码', localizedHook: 'iPad rẻ nhất cho sinh viên' },
        { titleZh: '智能家居全屋定制', titleVi: 'Smart home toàn diện', author: '@智能生活', localizedHook: 'Nhà thông minh điều khiển bằng giọng nói' },
        { titleZh: '机械键盘沉浸式打字音', titleVi: 'ASMR gõ bàn phím cơ', author: '@外设控', localizedHook: 'Âm thanh gây nghiện nhất' },
      ],
      HOME: [
        { titleZh: '沉浸式全屋大扫除', titleVi: 'Dọn dẹp nhà cửa chìm đắm (ASMR)', author: '@爱干净的太太', localizedHook: 'Dọn nhà ASMR siêu dính' },
        { titleZh: '出租屋低成本改造', titleVi: 'Cải tạo phòng trọ giá rẻ', author: '@改造小分队', localizedHook: 'Biến phòng trọ thành studio' },
        { titleZh: '提升幸福感的家居好物', titleVi: 'Đồ gia dụng nâng tầm hạnh phúc', author: '@好物研究所', localizedHook: 'Những món đồ hối hận vì không mua sớm' },
        { titleZh: '厨房收纳神仙技巧', titleVi: 'Tuyệt chiêu sắp xếp nhà bếp', author: '@收纳达人', localizedHook: 'Bếp nhỏ gọn gàng x2 không gian' },
        { titleZh: '氛围感卧室布置', titleVi: 'Decor phòng ngủ siêu chill', author: '@生活美学', localizedHook: 'Góc chill sau một ngày dài' },
        { titleZh: '懒人做饭神器', titleVi: 'Bảo bối nấu ăn cho người lười', author: '@美食日常', localizedHook: 'Nấu ăn không cần rửa nồi' },
      ]
    };

    const baseData = mockDb[category] || mockDb.COSMETICS;

    const results = baseData.map((item, idx) => {
      const views = Math.floor(Math.random() * 8000000) + 500000;
      const likes = Math.floor(views * 0.08);
      const comments = Math.floor(likes * 0.15);
      const shares = Math.floor(likes * 0.1);
      const viralFactor = (Math.random() * 2 + 8).toFixed(1); // 8.0 - 9.9
      const id = `douyin-${category.toLowerCase()}-${idx}`;

      return {
        id,
        titleZh: item.titleZh,
        titleVi: item.titleVi,
        author: item.author,
        coverUrl: `https://picsum.photos/seed/${id}/400/710`,
        views,
        likes,
        comments,
        shares,
        viralFactor,
        localizedHook: item.localizedHook,
        category
      };
    });

    results.sort((a, b) => parseFloat(b.viralFactor) - parseFloat(a.viralFactor));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in /api/douyin-trends:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
