import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploadWidgetProps {
  cloudName: string;
  uploadPreset: string;
  onSuccess: (result: CloudinaryUploadResult) => void;
  onError?: (error: any) => void;
  maxDuration?: number; // in seconds
  children: (props: { openWidget: () => void }) => React.ReactNode;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  duration: number;
  width: number;
  height: number;
  bytes: number;
}

export function CloudinaryUploadWidget({
  cloudName,
  uploadPreset,
  onSuccess,
  onError,
  maxDuration = 240, // 4 minutes default
  children,
}: CloudinaryUploadWidgetProps) {
  const widgetRef = useRef<any>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Load Cloudinary upload widget script
    if (!scriptLoaded.current && !window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
      };
      document.body.appendChild(script);
    } else {
      scriptLoaded.current = true;
    }
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget not loaded');
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local', 'camera'],
          resourceType: 'video',
          clientAllowedFormats: ['mp4', 'webm', 'mov', 'avi'],
          maxFileSize: 200000000, // 200MB
          maxVideoFileSize: 200000000,
          cropping: false,
          folder: 'reviews',
          tags: ['review', 'user-submission'],
          context: {
            alt: 'User review video',
          },
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Upload error:', error);
            onError?.(error);
            return;
          }

          if (result.event === 'success') {
            const videoData = result.info;

            // Validate duration
            if (videoData.duration && videoData.duration > maxDuration) {
              onError?.({
                message: `Video duration (${Math.round(videoData.duration)}s) exceeds maximum (${maxDuration}s)`,
              });
              return;
            }

            onSuccess({
              public_id: videoData.public_id,
              secure_url: videoData.secure_url,
              url: videoData.url,
              format: videoData.format,
              duration: videoData.duration || 0,
              width: videoData.width || 0,
              height: videoData.height || 0,
              bytes: videoData.bytes || 0,
            });
          }
        }
      );
    }

    widgetRef.current.open();
  };

  return <>{children({ openWidget })}</>;
}
