// Picking, compressing and uploading images. Photos are resized on the phone (max 1600 px wide,
// JPEG 80%), so uploads are a few hundred KB and well under the server's 3 MB limit.
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { api } from './api';
import { absoluteUrl } from './config';

const MAX_WIDTH = 1600;
const MAX_BYTES = 3 * 1024 * 1024;

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  fileName: string;
}

export async function pickImages(multiple: boolean): Promise<PickedImage[]> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted && permission.accessPrivileges !== 'limited') {
    throw new Error('Allow photo access in Settings to add images.');
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: multiple,
    selectionLimit: multiple ? 10 : 1,
    quality: 1,
  });
  if (result.canceled) return [];
  return result.assets.map((a, i) => ({
    uri: a.uri,
    width: a.width,
    height: a.height,
    fileName: a.fileName || `photo-${Date.now()}-${i}.jpg`,
  }));
}

export interface UploadedImage {
  // Shown in the editor straight away (the uploaded file is live after the site redeploys)
  dataUri: string;
  // Stored in the article
  url: string;
}

export async function compressAndUpload(image: PickedImage): Promise<UploadedImage> {
  const context = ImageManipulator.manipulate(image.uri);
  if (image.width > MAX_WIDTH) context.resize({ width: MAX_WIDTH });
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({ compress: 0.8, format: SaveFormat.JPEG, base64: true });
  const base64 = saved.base64;
  if (!base64) throw new Error('Could not read that image.');
  // base64 is 4/3 of the binary size
  if ((base64.length * 3) / 4 > MAX_BYTES) throw new Error('That image is too large, even after compression.');

  const { url } = await api.uploadImage({ filename: image.fileName, contentType: 'image/jpeg', data: base64 });
  return { dataUri: `data:image/jpeg;base64,${base64}`, url: absoluteUrl(url) };
}
