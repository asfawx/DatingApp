import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';

import { Photo } from '../../_models/Photo';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input()
  photos: Photo[];
  @Output()
  getMemberPhotoChange = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  currentMain: Photo;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.initalizeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initalizeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this._authService.decodedToken.nameid +
        '/photos/',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo: Photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };

        this.photos.push(photo);
        if (photo.isMain) {
          this._authService.changeMemberPhoto(photo.url);
          this._authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this._authService.currentUser)
          );
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this._userService
      .setMainPhoto(this._authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          this.currentMain = this.photos.filter(p => p.isMain === true)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;

          this._authService.changeMemberPhoto(photo.url);
          this._authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this._authService.currentUser)
          );
        },
        error => {
          this._alertifyService.error(error);
        }
      );
  }

  deletePhoto(id: number) {
    this._alertifyService.confirm(
      'Are you sure you want to delete this photo?',
      () => {
        this._userService
          .deletePhoto(this._authService.decodedToken.nameid, id)
          .subscribe(
            () => {
              this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
              this._alertifyService.success('Photo has been deleted');
            },
            error => {
              this._alertifyService.error('Failed to delete the photo');
            }
          );
      }
    );
  }
}
