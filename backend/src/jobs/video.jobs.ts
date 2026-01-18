import { Job } from 'agenda';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { ReviewSubmission } from '../models/ReviewSubmission.js';
import { getAbsolutePath } from '../utils/fileStore.js';

export async function generateThumbnailJob(job: Job): Promise<void> {
  const { submissionId } = job.attrs.data as { submissionId: string };

  console.log(`🎬 Generating thumbnail for submission ${submissionId}`);

  const submission = await ReviewSubmission.findById(submissionId);
  if (!submission || !submission.video.storagePath) {
    console.error(`Submission ${submissionId} not found or no video`);
    return;
  }

  const videoPath = getAbsolutePath(submission.video.storagePath);
  const thumbnailFilename = 'thumbnail.jpg';
  const thumbnailPath = path.join(
    path.dirname(videoPath),
    thumbnailFilename
  );

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:02'],
        filename: thumbnailFilename,
        folder: path.dirname(videoPath),
        size: '640x360',
      })
      .on('end', async () => {
        console.log(`✅ Thumbnail generated for ${submissionId}`);

        const relativeThumbnailPath = path.join(
          path.dirname(submission.video.storagePath),
          thumbnailFilename
        );
        submission.video.thumbnailPath = relativeThumbnailPath;
        await submission.save();

        resolve();
      })
      .on('error', (err) => {
        console.error(`❌ Error generating thumbnail for ${submissionId}:`, err.message);
        reject(err);
      });
  });
}
