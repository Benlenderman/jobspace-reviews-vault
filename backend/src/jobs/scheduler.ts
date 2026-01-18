import { Agenda } from 'agenda';
import { getConfig } from '../config/index.js';
import { generateThumbnailJob } from './video.jobs.js';
import { syncGoogleReviewsJob } from './google.jobs.js';

export async function setupAgenda(): Promise<Agenda> {
  const config = getConfig();

  const agenda = new Agenda({
    db: { address: config.MONGODB_URI, collection: 'agendaJobs' },
    processEvery: '30 seconds',
    maxConcurrency: 5,
  });

  agenda.define('generate-thumbnail', generateThumbnailJob);
  agenda.define('sync-google-reviews', syncGoogleReviewsJob);

  await agenda.start();

  if (config.GOOGLE_PLACES_API_KEY) {
    await agenda.every('6 hours', 'sync-google-reviews');
  }

  console.log('✅ Agenda scheduler started');

  return agenda;
}
