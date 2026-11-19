import confetti from 'canvas-confetti';

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0))
  );
};

export interface DownloadFeedback {
  success: boolean;
  isNativeShare: boolean;
  message: string;
}

/**
 * Downloads an MP4 video file and on mobile phones (iOS / Android) automatically
 * invokes the native Web Share API with the real video File object.
 * This directly triggers the native "Save Video / Save to Photos / Gallery" system sheet.
 * If Web Share is not supported or on desktop, falls back to direct MP4 blob download.
 */
export async function downloadOrSaveToGallery(
  videoUrl: string,
  videoTitle: string
): Promise<DownloadFeedback> {
  const isMobile = isMobileDevice();
  const cleanTitle = (videoTitle || 'clip').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
  const filename = `${cleanTitle}.mp4`;

  try {
    // 1. Fetch the real MP4 video blob
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Download server responded with HTTP ${response.status}`);
    }

    const blob = await response.blob();
    // Ensure MIME type is video/mp4 for mobile gallery scanner recognition
    const videoBlob = blob.type === 'video/mp4' ? blob : new Blob([blob], { type: 'video/mp4' });
    const videoFile = new File([videoBlob], filename, { type: 'video/mp4' });

    // 2. On Mobile Phones: Trigger Native Share Sheet for direct "Save Video / Photos / Gallery"
    if (isMobile && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [videoFile] })) {
      try {
        await navigator.share({
          files: [videoFile],
          title: videoTitle,
          text: `Save "${videoTitle}" to your Photos / Gallery`
        });

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });

        return {
          success: true,
          isNativeShare: true,
          message: 'Choose "Save Video" in the share sheet to save directly to your Phone Photos / Gallery! 📲'
        };
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') {
          return {
            success: true,
            isNativeShare: true,
            message: 'Share cancelled.'
          };
        }
        console.warn('Native share failed, falling back to direct blob download:', shareErr);
      }
    }

    // 3. Direct Blob URL Download (Desktop or when native share is unavailable)
    const blobUrl = URL.createObjectURL(videoBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 }
    });

    return {
      success: true,
      isNativeShare: false,
      message: isMobile
        ? 'Video downloaded! Check your Phone Gallery / Photos or Downloads folder. 📲'
        : 'MP4 Video exported and downloaded successfully! 📥'
    };
  } catch (err: any) {
    console.warn('Blob fetch failed, falling back to direct anchor link:', err);

    // 4. Ultimate fallback: Direct link download
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      success: true,
      isNativeShare: false,
      message: 'Download initiated! 📥'
    };
  }
}
