import { NextResponse } from 'next/server';
import { DeconstructedScript, ScriptPhase, ViralComment } from '@/types/core';

export async function POST(req: Request) {
  try {
    const { videoUrl, videoTitle, category } = await req.json();

    if (!videoTitle || !category) {
      return NextResponse.json({ error: 'Missing videoTitle or category' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Hardcoded fallback data
    const isPet = category.includes('PET') || (videoTitle && (videoTitle.includes('chó') || videoTitle.includes('mèo') || videoTitle.includes('cún')));

    const fallbackComments: ViralComment[] = isPet ? [
      { id: 'c1', author: '@mebap_corgi', text: 'Chó con 2 tháng tuổi dùng tắm có cay mắt hay ngứa da không shop?', likes: '14.2k', type: 'QUESTION', selectedAsHook: true },
      { id: 'c2', author: '@boss_poodle', text: 'Tắm xong thơm nức mũi cả tuần, lông mềm như bông gòn!', likes: '28.9k', type: 'PRAISE' },
      { id: 'c3', author: '@nguyen_an', text: 'Có trị được ve rận và bọ chét thật không hay chỉ thơm thôi?', likes: '6.4k', type: 'OBJECTION' },
      { id: 'c4', author: '@sen_beo', text: 'Con cún nhà mình sợ nước mà tắm loại này lại nằm im hưởng thụ haha', likes: '35.1k', type: 'FUNNY' },
    ] : [
      { id: 'c1', author: '@user123', text: 'Cái này có tác dụng thật không mọi người?', likes: '1.2k', type: 'QUESTION', selectedAsHook: true },
      { id: 'c2', author: '@beauty_lover', text: 'Đã dùng và thấy da cải thiện rõ sau 2 tuần nhé!', likes: '890', type: 'PRAISE' },
      { id: 'c3', author: '@skep_tic', text: 'Chắc lại quảng cáo lố rồi, làm gì có chuyện thần thánh thế.', likes: '456', type: 'OBJECTION' },
      { id: 'c4', author: '@funny_guy', text: 'Xài xong thành tiên nữ luôn à 😂', likes: '3.4k', type: 'FUNNY' },
    ];

    const fallbackPhases: ScriptPhase[] = isPet ? [
      { phaseType: 'HOOK', label: 'Hook (3s đầu)', startSec: 0, endSec: 3, durationSec: 3, spokenText: `Dừng lại ngay nếu bạn vẫn đang tắm cho cún mèo bằng xà phòng thường!`, visualDescription: 'Cận cảnh cún cưng nhăn mũi gãi ngứa khó chịu', textOverlay: 'DỪNG LẠI 3 GIÂY ⚠️', cameraWork: 'Zoom in nhanh', emotionBeat: 'Cảnh báo, Tò mò', requiredFootageTag: 'PET_CUTE' },
      { phaseType: 'PROBLEM', label: 'Nỗi đau (3-8s)', startSec: 3, endSec: 8, durationSec: 5, spokenText: 'Lông xơ xác, bết dính và ve rận ngứa ngáy cả ngày', visualDescription: 'Người chủ vuốt ve nhưng cún gãi liên tục', textOverlay: 'HÔI RÌNH & NGỨA NGÁY', cameraWork: 'Cầm tay chân thực', emotionBeat: 'Đồng cảm, Lo lắng', requiredFootageTag: 'PERSON_FRUSTRATED' },
      { phaseType: 'SOLUTION', label: 'Giải pháp (8-15s)', startSec: 8, endSec: 15, durationSec: 7, spokenText: `Bí quyết chính là ${videoTitle || 'Sữa tắm 2 trong 1'}, dưỡng lông thơm mát`, visualDescription: 'Chai sữa tắm đặt trang trọng, bọt bông xốp mịn', textOverlay: 'GIẢI PHÁP 2 TRONG 1 ✨', cameraWork: 'Xoay quanh sản phẩm', emotionBeat: 'Hy vọng, Thích thú', requiredFootageTag: 'PRODUCT_HERO' },
      { phaseType: 'DEMO', label: 'Demo (15-22s)', startSec: 15, endSec: 22, durationSec: 7, spokenText: 'Bọt xốp mềm mịn massage thư thái như đi spa', visualDescription: 'Đôi tay xoa bọt êm ái lên lông cún cưng', textOverlay: 'THƯ GIÃN NHƯ SPA 🛁', cameraWork: 'Góc nhìn thứ nhất (POV)', emotionBeat: 'Thư giãn ASMR', requiredFootageTag: 'PET_BATH' },
      { phaseType: 'PROOF', label: 'Bằng chứng (22-28s)', startSec: 22, endSec: 28, durationSec: 6, spokenText: 'Lông bung mượt bồng bềnh, thơm nức 7 ngày liên tục', visualDescription: 'Cún cưng chạy nhảy tung tăng, lông trắng muốt sáng bóng', textOverlay: 'THƠM NỨC 7 NGÀY 🏆', cameraWork: 'Slow motion', emotionBeat: 'Hài lòng tuyệt đối', requiredFootageTag: 'BEFORE_AFTER' },
      { phaseType: 'CTA', label: 'Kêu gọi hành động (28-30s)', startSec: 28, endSec: 30, durationSec: 2, spokenText: 'Bấm ngay giỏ hàng nhận deal mua 1 tặng 1 hôm nay!', visualDescription: 'Chỉ tay xuống giỏ hàng góc trái', textOverlay: 'MUA 1 TẶNG 1 HÔM NAY 🛒', cameraWork: 'Punch zoom dứt khoát', emotionBeat: 'Khẩn cấp (FOMO)', requiredFootageTag: 'PRODUCT_PACKSHOT' },
    ] : [
      { phaseType: 'HOOK', label: 'Hook (3s đầu)', startSec: 0, endSec: 3, durationSec: 3, spokenText: 'Dừng lại ngay nếu bạn đang...', visualDescription: 'Cận cảnh khuôn mặt với biểu cảm lo lắng', textOverlay: 'SAI LẦM KHI CHĂM DA', cameraWork: 'Zoom in nhanh', emotionBeat: 'Sốc, Tò mò', requiredFootageTag: 'PERSON_FRUSTRATED' },
      { phaseType: 'PROBLEM', label: 'Nỗi đau (3-8s)', startSec: 3, endSec: 8, durationSec: 5, spokenText: 'Da mụn lặp đi lặp lại không dứt', visualDescription: 'Cảnh nặn mụn, bôi kem sai cách', textOverlay: 'MỤN DAI DẲNG', cameraWork: 'Cầm tay rung nhẹ', emotionBeat: 'Khó chịu, Bất lực', requiredFootageTag: 'BEFORE_AFTER' },
      { phaseType: 'SOLUTION', label: 'Giải pháp (8-15s)', startSec: 8, endSec: 15, durationSec: 7, spokenText: 'Đây là cứu tinh của mình', visualDescription: 'Giới thiệu sản phẩm với ánh sáng đẹp', textOverlay: 'CỨU TINH LÀ ĐÂY', cameraWork: 'Pan mượt mà', emotionBeat: 'Hy vọng', requiredFootageTag: 'PRODUCT_HERO' },
      { phaseType: 'DEMO', label: 'Demo (15-22s)', startSec: 15, endSec: 22, durationSec: 7, spokenText: 'Chất kem mỏng nhẹ thấm nhanh', visualDescription: 'Thoa kem lên tay, cận cảnh texture', textOverlay: 'THẤM NHANH 3S', cameraWork: 'Cận cảnh (Macro)', emotionBeat: 'Tin tưởng', requiredFootageTag: 'TEXTURE_MACRO' },
      { phaseType: 'PROOF', label: 'Bằng chứng (22-28s)', startSec: 22, endSec: 28, durationSec: 6, spokenText: 'Hàng ngàn người đã dùng thử', visualDescription: 'Lướt các feedback, đánh giá 5 sao', textOverlay: '10.000+ LƯỢT MUA', cameraWork: 'Tĩnh', emotionBeat: 'Thuyết phục', requiredFootageTag: 'UGC_TESTIMONIAL' },
      { phaseType: 'CTA', label: 'Kêu gọi hành động (28-30s)', startSec: 28, endSec: 30, durationSec: 2, spokenText: 'Click giỏ hàng mua ngay!', visualDescription: 'Chỉ tay xuống giỏ hàng', textOverlay: 'MUA NGAY GIẢM 50%', cameraWork: 'Zoom nhẹ', emotionBeat: 'Gấp gáp (FOMO)', requiredFootageTag: 'PRODUCT_PACKSHOT' },
    ];

    const fallbackDeconstruction: DeconstructedScript = {
      sourceVideoUrl: videoUrl || 'https://tiktok.com/@example/video',
      sourceTitle: videoTitle,
      totalDurationSec: 30,
      phases: fallbackPhases,
      primaryJTBD: isPet ? 'Chăm sóc cún mèo thơm sạch, mượt lông mà không tốn tiền đi spa' : 'Giúp khách hàng giải quyết vấn đề nhanh chóng',
      targetEmotion: isPet ? 'Từ lo lắng về mùi hôi sang sung sướng thơm tho' : 'Từ thất vọng chuyển sang vui sướng',
      objections: isPet ? ['Sợ cay mắt thú cưng', 'Sợ mùi nồng hóa học', 'Sợ không sạch ve rận'] : ['Sợ không hiệu quả', 'Sợ kích ứng', 'Giá cao'],
      proofMechanisms: isPet ? ['Lông mềm bồng bềnh', 'Hết sạch ve rận', 'Review người nuôi thật'] : ['Before/After', 'Thành phần khoa học', 'Feedback thực tế'],
      viralComments: fallbackComments,
      audioMood: 'UPBEAT',
      pacing: 'FAST_CUT'
    };

    const hasValidKey = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10;

    if (!hasValidKey) {
      console.warn('GEMINI_API_KEY missing or placeholder. Returning fallback data.');
      return NextResponse.json(fallbackDeconstruction);
    }

    const prompt = `Analyze the provided video details and generate a TikTok ad script deconstruction.
Video Title: "${videoTitle}"
Category: "${category}"

Generate a JSON object strictly matching this schema:
{
  "sourceVideoUrl": "url",
  "sourceTitle": "title",
  "totalDurationSec": 30,
  "primaryJTBD": "job to be done in Vietnamese",
  "targetEmotion": "target emotion in Vietnamese",
  "objections": ["objection 1", "objection 2", "objection 3"],
  "proofMechanisms": ["proof 1", "proof 2"],
  "audioMood": "UPBEAT",
  "pacing": "FAST_CUT",
  "phases": [
    {
      "phaseType": "HOOK" | "PROBLEM" | "SOLUTION" | "DEMO" | "PROOF" | "CTA",
      "label": "Vietnamese label",
      "startSec": 0,
      "endSec": 5,
      "durationSec": 5,
      "spokenText": "Vietnamese spoken text",
      "visualDescription": "Vietnamese visual description",
      "textOverlay": "Vietnamese text overlay",
      "cameraWork": "Vietnamese camera work",
      "emotionBeat": "Vietnamese emotion beat",
      "requiredFootageTag": "PRODUCT_HERO"
    }
  ],
  "viralComments": [
    {
      "id": "c1",
      "author": "@author",
      "text": "Vietnamese comment text",
      "likes": "1.2k",
      "type": "OBJECTION" | "PRAISE" | "QUESTION" | "FUNNY",
      "selectedAsHook": true
    }
  ]
}
Return ONLY valid JSON. Ensure there are exactly 6 phases (Hook, Problem, Solution, Demo, Proof, CTA) and 4 viral comments. Use Vietnamese for content. FootageTag must be one of: PRODUCT_HERO, PRODUCT_IN_USE, PRODUCT_PACKSHOT, TEXTURE_MACRO, BEFORE_AFTER, PERSON_FRUSTRATED, PERSON_HAPPY, HANDS_UNBOX, LIFESTYLE_AMBIENT, EXPERT_AUTHORITY, UGC_TESTIMONIAL, PET_CUTE, PET_BATH, NATURE_INGREDIENT.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error('No text returned from Gemini');
      }

      const parsed = JSON.parse(rawText) as DeconstructedScript;
      // Ensure sourceVideoUrl is preserved if it was passed
      parsed.sourceVideoUrl = videoUrl || parsed.sourceVideoUrl || 'https://tiktok.com/@example/video';
      
      return NextResponse.json(parsed);

    } catch (err) {
      console.error('Failed to parse Gemini response or fetch error:', err);
      return NextResponse.json(fallbackDeconstruction);
    }

  } catch (error) {
    console.error('Error in /api/deconstruct:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
