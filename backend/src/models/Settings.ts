import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: any;
}

const settingsSchema = new Schema<ISettings>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export async function getSetting<T = any>(key: string, defaultValue?: T): Promise<T | undefined> {
  const setting = await Settings.findOne({ key });
  return setting ? setting.value : defaultValue;
}

export async function setSetting(key: string, value: any): Promise<void> {
  await Settings.findOneAndUpdate({ key }, { value }, { upsert: true });
}
