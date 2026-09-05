import { VideoTimeline, TimelineClip, OverlayLayer } from '../types/core';

function easeOutBounce(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export async function renderVideoFromTimeline(
  timeline: VideoTimeline,
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  const { width, height } = timeline.resolution;
  const fps = timeline.fps || 30;
  const durationSec = timeline.totalDurationSec;
  const totalFrames = Math.floor(durationSec * fps);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get 2d context');

  onProgress?.(0, 'Đang tải tài nguyên...');
  
  const loadedAssets = new Map<string, HTMLImageElement | HTMLVideoElement>();
  
  await Promise.all(
    timeline.clips.map(async (clip) => {
      if (loadedAssets.has(clip.footageUrl)) return;
      
      try {
        if (clip.footageType === 'IMAGE') {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Lỗi tải ảnh: ${clip.footageUrl}`));
            img.src = clip.footageUrl;
          });
          loadedAssets.set(clip.footageUrl, img);
        } else {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.playsInline = true;
          await new Promise<void>((resolve, reject) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => reject(new Error(`Lỗi tải video: ${clip.footageUrl}`));
            video.src = clip.footageUrl;
            video.load();
          });
          loadedAssets.set(clip.footageUrl, video);
        }
      } catch (e) {
        console.warn(e);
      }
    })
  );

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  
  let options = { mimeType: 'video/mp4' };
  if (!MediaRecorder.isTypeSupported('video/mp4')) {
    options = { mimeType: 'video/webm' };
  }

  const canvasStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks()
  ]);

  const recorder = new MediaRecorder(combinedStream, options);
  const chunks: Blob[] = [];
  
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: options.mimeType }));
    };
  });

  recorder.start();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(dest);
  osc.start(0);

  for (let i = 0; i < totalFrames; i++) {
    const timeSec = i / fps;
    const progress = Math.round((i / totalFrames) * 100);
    
    if (i % fps === 0) {
      onProgress?.(progress, `Đang kết xuất... ${progress}%`);
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    }
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const activeClipIndex = timeline.clips.findIndex(
      (c) => timeSec >= c.startOnTimelineSec && timeSec < c.startOnTimelineSec + c.durationSec
    );

    if (activeClipIndex !== -1) {
      const clip = timeline.clips[activeClipIndex];
      const asset = loadedAssets.get(clip.footageUrl);
      
      const clipTime = timeSec - clip.startOnTimelineSec;
      const progressInClip = clipTime / clip.durationSec;
      
      if (asset) {
        ctx.save();
        if (clip.footageType === 'IMAGE') {
          let scale = 1;
          if (clip.kenBurns) {
            scale = lerp(clip.kenBurns.startScale, clip.kenBurns.endScale, easeInOutCubic(progressInClip));
          }
          
          ctx.translate(width / 2, height / 2);
          ctx.scale(scale, scale);
          
          const img = asset as HTMLImageElement;
          const sRatio = width / height;
          const iRatio = img.width / img.height;
          let dw = width, dh = height;
          
          if (sRatio > iRatio) {
            dw = width;
            dh = width / iRatio;
          } else {
            dh = height;
            dw = height * iRatio;
          }
          
          ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        } else {
          const video = asset as HTMLVideoElement;
          const sourceStart = clip.sourceStartSec || 0;
          video.currentTime = sourceStart + clipTime * (clip.playbackSpeed || 1);
          
          const sRatio = width / height;
          const vRatio = video.videoWidth / video.videoHeight;
          let dw = width, dh = height;
          
          if (sRatio > vRatio) {
            dw = width;
            dh = width / vRatio;
          } else {
            dh = height;
            dw = height * vRatio;
          }
          
          ctx.drawImage(video, (width - dw) / 2, (height - dh) / 2, dw, dh);
        }
        ctx.restore();
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#222');
        grad.addColorStop(1, '#444');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
      
      if (activeClipIndex < timeline.clips.length - 1) {
        const nextClip = timeline.clips[activeClipIndex + 1];
        const overlap = 0.5;
        if (timeSec > nextClip.startOnTimelineSec - overlap && clip.transition === 'CROSSFADE') {
          const t = (timeSec - (nextClip.startOnTimelineSec - overlap)) / overlap;
          ctx.fillStyle = `rgba(0,0,0,${t})`;
          ctx.fillRect(0, 0, width, height);
        }
      }
    }

    const vignette = ctx.createLinearGradient(0, 0, 0, height);
    vignette.addColorStop(0, 'rgba(0,0,0,0.5)');
    vignette.addColorStop(0.2, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.8, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    timeline.overlays.forEach((overlay) => {
      if (timeSec >= overlay.startSec && timeSec <= overlay.endSec) {
        ctx.save();
        
        let alpha = 1;
        let scale = 1;
        let dy = 0;
        
        const inTime = timeSec - overlay.startSec;
        const outTime = overlay.endSec - timeSec;
        
        if (overlay.animation === 'FADE_IN' && inTime < 0.5) alpha = inTime / 0.5;
        if (overlay.animation === 'SLIDE_UP' && inTime < 0.5) dy = (1 - easeInOutCubic(inTime / 0.5)) * 50;
        if (overlay.animation === 'BOUNCE' && inTime < 1) scale = easeOutBounce(inTime);
        
        if (outTime < 0.3) alpha = outTime / 0.3;
        
        ctx.globalAlpha = alpha;
        
        const x = overlay.position.x * width;
        const y = overlay.position.y * height + dy;
        
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        if (overlay.type === 'HOOK_TEXT') {
          ctx.fillStyle = '#000';
          ctx.fillRect(-width/2 + 20, -overlay.style.fontSize, width - 40, overlay.style.fontSize * 1.5);
          ctx.fillStyle = overlay.style.color || '#ffeb3b';
          ctx.font = `bold ${overlay.style.fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(overlay.content, 0, 0, width - 40);
        } else if (overlay.type === 'SUBTITLE') {
          ctx.fillStyle = overlay.style.color || '#ffffff';
          ctx.font = `${overlay.style.fontWeight || 'normal'} ${overlay.style.fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(overlay.content, 0, 0, width - 40);
          ctx.shadowColor = 'transparent';
        } else if (overlay.type === 'BADGE') {
          ctx.fillStyle = overlay.style.bgColor || '#fe2c55';
          const tw = ctx.measureText(overlay.content).width + 20;
          const th = overlay.style.fontSize * 1.5;
          ctx.beginPath();
          ctx.roundRect(-tw/2, -th/2, tw, th, overlay.style.borderRadius || 10);
          ctx.fill();
          ctx.fillStyle = overlay.style.color || '#fff';
          ctx.font = `${overlay.style.fontWeight || 'bold'} ${overlay.style.fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(overlay.content, 0, 0);
        } else if (overlay.type === 'COMMENT_STICKER') {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.roundRect(-150, -40, 300, 80, 15);
          ctx.fill();
          ctx.fillStyle = '#666';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('💬 Trả lời @author:', -135, -15);
          ctx.fillStyle = '#000';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(overlay.content, -135, 10);
        } else if (overlay.type === 'CTA_BUTTON') {
          ctx.fillStyle = '#fe2c55';
          ctx.beginPath();
          ctx.roundRect(-100, -25, 200, 50, 25);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(overlay.content, 0, 0);
        } else if (overlay.type === 'PROGRESS_BAR') {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillRect(-width/2, 0, width, 4);
          ctx.fillStyle = '#fe2c55';
          ctx.fillRect(-width/2, 0, width * (timeSec / durationSec), 4);
        }
        
        ctx.restore();
      }
    });

    ctx.save();
    ctx.fillStyle = '#fff';
    const uiX = width - 40;
    
    ctx.beginPath(); ctx.arc(uiX, height/2 - 50, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(uiX, height/2 + 20, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(uiX, height/2 + 90, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(uiX, height/2 + 160, 20, 0, Math.PI*2); ctx.fill();
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('102K', uiX, height/2 - 20);
    ctx.fillText('456', uiX, height/2 + 50);
    ctx.fillText('12K', uiX, height/2 + 120);
    ctx.fillText('Share', uiX, height/2 + 190);
    
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('@creator_name', 20, height - 100);
    ctx.font = '14px sans-serif';
    ctx.fillText('🎵 Original sound - TikTok Beat', 20, height - 75);
    
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.roundRect(20, 20, 80, 30, 15);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AdMatrix', 60, 35);
    
    ctx.translate(uiX, height - 80);
    ctx.rotate(timeSec * Math.PI);
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#555';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
    
    ctx.restore();

    await new Promise((r) => setTimeout(r, 1000 / fps / 3));
  }

  recorder.stop();
  osc.stop();
  audioCtx.close();
  
  onProgress?.(100, 'Hoàn thành!');
  return recordingPromise;
}

export async function exportAndDownloadMP4(
  timeline: VideoTimeline,
  filename: string,
  onProgress?: (percent: number, message: string) => void
): Promise<void> {
  const blob = await renderVideoFromTimeline(timeline, onProgress);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
