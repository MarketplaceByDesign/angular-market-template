import { Injectable } from '@angular/core';
import { FileUploadDownloadService } from '@mbd-common-libs/angular-common-services';
import { Observable } from 'rxjs';
import { HttpResponse, HttpUploadProgressEvent } from '@angular/common/http';
import { FileUploaderService, FileDetails } from '@mbd-common-libs/angular-common-components';

@Injectable()
export class FileService extends FileUploaderService {
    constructor(private fileUploaderService: FileUploadDownloadService) {
        super();
    }

    fileUploadRequest(
        file: FormData,
        isPrivate: boolean,
        hash?: string[],
    ): Observable<HttpResponse<FileDetails> | HttpUploadProgressEvent> {
        return this.fileUploaderService.uploadToOpenChannel(file, isPrivate, hash);
    }

    fileDetailsRequest(fileId: string): Observable<FileDetails> {
        return this.fileUploaderService.downloadFileDetails(fileId);
    }
}
