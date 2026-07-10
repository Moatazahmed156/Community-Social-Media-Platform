import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'fileUrl',
  standalone: true,
})
export class FileUrlPipe implements PipeTransform {
  transform(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.fileBaseUrl}${path}`;
  }
}
