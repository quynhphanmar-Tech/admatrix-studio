export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get('industry') || 'COSMETICS';
    const sort_by = searchParams.get('sort_by') || 'views';
    const q = searchParams.get('q') || '';

    // Mock data based on industry
    const mockDb: Record<string, any[]> = {
      COSMETICS: [
        { brandName: 'Lemonade Cosmetics', hook: 'Đừng mua cushion này nếu bạn không muốn da đẹp' },
        { brandName: 'Cocoon', hook: 'Sự thật về tẩy da chết cà phê Đắk Lắk' },
        { brandName: 'Focallure', hook: 'Makeup đi học chỉ với 50k?' },
        { brandName: 'Maybelline VN', hook: 'Thử thách son lì ăn lẩu không trôi' },
        { brandName: 'Perfect Diary', hook: 'Unbox son môi hot nhất tuần qua' },
        { brandName: 'L\'Oréal Paris', hook: 'Serum HA này có thực sự cấp ẩm?' },
        { brandName: 'Paula\'s Choice', hook: 'BHA trị mụn ẩn - dùng sao cho đúng?' },
        { brandName: 'Kiehl\'s VN', hook: 'Da dầu mụn bơi hết vào đây' }
      ],
      PET_SUPPLIES: [
        { brandName: 'Paddy Pet Shop', hook: 'Mèo kén ăn phải làm sao?' },
        { brandName: 'Me-O', hook: 'Pate này có gì mà boss ghiền thế' },
        { brandName: 'King\'s Pet', hook: 'Review cát vệ sinh khử mùi siêu đỉnh' },
        { brandName: 'Doggo VN', hook: 'Đồ chơi cho cún không thể bỏ qua' },
        { brandName: 'Pet Mart', hook: 'Sữa tắm giảm rụng lông thần thánh' },
        { brandName: 'Whiskas', hook: 'Bí kíp nuôi mèo mập mạp' },
        { brandName: 'Royal Canin', hook: 'Hạt khô cho chó con kén ăn' },
        { brandName: 'Bầu Trời Thú Cưng', hook: 'Vòng cổ chống rận hiệu quả không?' }
      ],
      EDUCATION: [
        { brandName: 'VUS', hook: 'Mất gốc tiếng Anh bắt đầu từ đâu?' },
        { brandName: 'Edumall', hook: 'Khóa học thiết kế cho người mới bắt đầu' },
        { brandName: 'Prep.vn', hook: 'Tự học IELTS 7.0 trong 3 tháng' },
        { brandName: 'Topica', hook: 'Nói tiếng Anh trôi chảy chỉ sau 1 tháng' },
        { brandName: 'Elight', hook: 'Quy tắc phát âm 99% người Việt sai' },
        { brandName: 'MindX', hook: 'Lộ trình học lập trình kiếm 20 triệu/tháng' },
        { brandName: 'KTcity', hook: 'Cách làm Affiliate Marketing cho người mới' },
        { brandName: 'Monkey Junior', hook: 'Giúp bé học tiếng Anh siêu dễ' }
      ],
      FASHION: [
        { brandName: 'Coolmate', hook: 'Chiếc áo thun nam giới nào cũng nên có' },
        { brandName: 'Yody', hook: 'Phối đồ đi làm thanh lịch mà vẫn thoải mái' },
        { brandName: 'Dirty Coins', hook: 'Local brand nào đang hot nhất?' },
        { brandName: 'GUMAC', hook: 'Váy thiết kế sale sập sàn' },
        { brandName: 'ClownZ', hook: 'Outfit streetwear ngầu lòi' },
        { brandName: 'HNOSS', hook: 'BST váy cưới mùa thu' },
        { brandName: 'Biti\'s Hunter', hook: 'Đôi giày chạy bộ đáng mua nhất năm' },
        { brandName: 'Juno', hook: 'Túi xách da thật dưới 500k' }
      ],
      TECH: [
        { brandName: 'CellphoneS', hook: 'iPhone 15 Pro Max có đáng nâng cấp?' },
        { brandName: 'FPT Shop', hook: 'Laptop sinh viên dưới 15 triệu' },
        { brandName: 'Thế Giới Di Động', hook: 'Smartwatch đo nhịp tim chuẩn nhất' },
        { brandName: 'GearVN', hook: 'Build PC chiến game 10 triệu' },
        { brandName: 'Hoàng Hà Mobile', hook: 'Điện thoại chụp ảnh đẹp giá rẻ' },
        { brandName: 'Di Động Việt', hook: 'iPad cũ mua ở đâu uy tín?' },
        { brandName: 'An Phát PC', hook: 'Bàn phím cơ gõ êm nhất' },
        { brandName: 'Hacom', hook: 'Chuột gaming không dây pin trâu' }
      ],
      HOME: [
        { brandName: 'Inochi', hook: 'Hộp đựng thực phẩm thông minh' },
        { brandName: 'Sunhouse', hook: 'Nồi chiên không dầu có thực sự thần thánh?' },
        { brandName: 'LocknLock', hook: 'Bình giữ nhiệt giữ đá 24h' },
        { brandName: 'Dyson VN', hook: 'Máy hút bụi không dây đỉnh cao' },
        { brandName: 'Gnome', hook: 'Decor phòng ngủ siêu xinh' },
        { brandName: 'JYSK', hook: 'Sofa Bắc Âu giảm giá' },
        { brandName: 'Kangaroo', hook: 'Máy lọc nước có cần thiết?' },
        { brandName: 'Philips', hook: 'Bàn ủi hơi nước cầm tay tiện lợi' }
      ]
    };

    const baseData = mockDb[industry] || mockDb.COSMETICS;

    let results = baseData.map((item, idx) => {
      const views = Math.floor(Math.random() * 5000000) + 100000;
      const likes = Math.floor(views * 0.05);
      const comments = Math.floor(likes * 0.1);
      const saves = Math.floor(likes * 0.2);
      const cvr = (Math.random() * 3 + 0.5).toFixed(2);
      const id = `tiktok-${industry.toLowerCase()}-${idx}`;

      return {
        id,
        title: item.hook,
        brandName: item.brandName,
        category: industry,
        verbalHook: item.hook,
        likes,
        comments,
        saves,
        views,
        ctrRank: idx < 3 ? 'Top 1%' : (idx < 6 ? 'Top 10%' : 'Top 25%'),
        cvr: `${cvr}%`,
        imgUrl: `https://picsum.photos/seed/${id}/400/710`,
        videoSampleUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        durationSec: Math.floor(Math.random() * 45) + 15
      };
    });

    if (q) {
      const qLower = q.toLowerCase();
      const qWords = qLower.split(/\s+/).filter(w => w.length > 1);

      // Auto-detect industry from query
      const petKeywords = ["chó", "mèo", "thú cưng", "pet", "rận", "pate", "sữa tắm", "tắm chó", "cún", "boss", "lông"];
      const cosKeywords = ["da", "mụn", "serum", "kem", "son", "mỹ phẩm", "skincare", "nám", "chống nắng", "dưỡng"];
      const eduKeywords = ["học", "tiếng anh", "ielts", "khóa học", "đào tạo", "chuyên gia", "english"];
      
      const matchedResults = results.filter(r => {
        const text = (r.title + " " + r.brandName + " " + r.verbalHook).toLowerCase();
        return text.includes(qLower) || qWords.some(w => text.includes(w));
      });

      // If no exact match in current category, search across all categories or generate dynamic matches for the user's query
      if (matchedResults.length === 0) {
        // Generate dynamic customized Top Ads for this exact query
        const generatedMatches = [
          {
            id: `tiktok-custom-1`,
            title: `${q} - Bí quyết chăm sóc hiệu quả 100%`,
            brandName: `Kinido Pet Official`,
            category: industry,
            verbalHook: `Đừng bỏ qua nếu bạn đang tìm kiếm ${q} tốt nhất!`,
            likes: 185400,
            comments: 12400,
            saves: 28900,
            views: 3200000,
            ctrRank: 'Top 1%',
            cvr: '4.8%',
            imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80',
            videoSampleUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            durationSec: 30
          },
          {
            id: `tiktok-custom-2`,
            title: `Review thật ${q} sau 7 ngày trải nghiệm`,
            brandName: `Pet Care Spa VN`,
            category: industry,
            verbalHook: `Dừng lại 3 giây: Đây là loại ${q} cứu tinh cho các bạn!`,
            likes: 142000,
            comments: 8900,
            saves: 19500,
            views: 2450000,
            ctrRank: 'Top 3%',
            cvr: '3.9%',
            imgUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80',
            videoSampleUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            durationSec: 28
          },
          {
            id: `tiktok-custom-3`,
            title: `Bật mí mẹo sử dụng ${q} thơm lâu mượt lông`,
            brandName: `Sen & Boss Vlog`,
            category: industry,
            verbalHook: `Bạn đã biết cách chọn ${q} an toàn không cay mắt chưa?`,
            likes: 98000,
            comments: 6500,
            saves: 14200,
            views: 1800000,
            ctrRank: 'Top 5%',
            cvr: '3.2%',
            imgUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&q=80',
            videoSampleUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            durationSec: 35
          },
          {
            id: `tiktok-custom-4`,
            title: `Cảnh báo khi chọn ${q} giá rẻ trôi nổi`,
            brandName: `Bác Sĩ Thú Y 247`,
            category: industry,
            verbalHook: `90% người nuôi thú cưng mắc sai lầm nghiêm trọng này!`,
            likes: 210000,
            comments: 15600,
            saves: 34000,
            views: 4100000,
            ctrRank: 'Top 1%',
            cvr: '5.2%',
            imgUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
            videoSampleUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            durationSec: 32
          }
        ];
        results = generatedMatches;
      } else {
        results = matchedResults;
      }
    }

    if (sort_by === 'likes') {
      results.sort((a, b) => b.likes - a.likes);
    } else if (sort_by === 'cvr') {
      results.sort((a, b) => parseFloat(b.cvr) - parseFloat(a.cvr));
    } else {
      // default views
      results.sort((a, b) => b.views - a.views);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in /api/tiktok-topads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
