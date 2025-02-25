import { inject, Pipe, PipeTransform } from '@angular/core';
import { StorageApi } from '@shared/apis/storage.api';
import { eBucketName } from '@shared/enums/bucket-name.enum';

@Pipe({
  name: 'downloadStorage',
  standalone: true,
})
export class DownloadStoragePipe implements PipeTransform {
  private storageApi = inject(StorageApi);

  async transform(imageUrl?: string | File | null, bucket = eBucketName.AVATARS): Promise<string> {
    if (!imageUrl) return '';
    if (imageUrl instanceof File) return this.blobToBase64(imageUrl);
    if (imageUrl.startsWith('http')) return imageUrl;

    const { data } = await this.storageApi.download(bucket, imageUrl);
    return this.blobToBase64(data as Blob);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
}
