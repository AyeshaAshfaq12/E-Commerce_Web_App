import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Image, Images, ImagesToUpload } from 'Models/product';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-create-product-step-two',
  templateUrl: './create-product-step-two.component.html',
  styleUrls: ['./create-product-step-two.component.css'],
})
export class CreateProductStepTwoComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() id: string = 'Subhan';
  deleteFiles: Images[] = [];
  uploadedFiles: ImagesToUpload[] = [];
  selectedFiles: File[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  @Output() nextClicked = new EventEmitter<string>();
  @Input() closeClicked = new EventEmitter<void>();
  previews: string[] = [];
  imageInfos?: Observable<any>;
  _id: String;

  totalFileCount(): boolean {
    return !(this.uploadedFiles.length <= 4);
  }

  getSanitizedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  ngOnInit() {
    this._id = this.id;
    if (this._id) {
      this.productService.getProduct(this._id).subscribe(
        (response) => {
          // this.uploadedFiles = response.images;
          // // console.error('Response Subhan', response);

          response.images.forEach((image: Images) => {
            this.uploadedFiles.push({
              image: image,
              name: image.public_id,
            });
            // alert(image);
            // alert(JSON.stringify(this.uploadedFiles));
          });
          // this.uploadedFiles = response;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed ',
            detail: 'Failed to Load Images',
          });
          console.error('File upload failed', error);
        }
      );
    }
  }
  constructor(
    private imageService: ImageUploadService,
    private messageService: MessageService,
    private productService: ProductService,
    private eventEmitterService: EventEmitterService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
  ) {
    this._id = this.id;
  }
  onFileUpload(event: any): void {
    for (const file of event.files) {
      // alert(file);
      console.error(file);
      // return;
      // this.selectedFiles.push(file);
      this.selectedFiles.push(file);
      this.uploadedFiles.push({
        name: file.name,
        file: file,
      });
      // this.imageService.uploadImages(this.id, [file]).subscribe(
      //   (response) => {
      //     // alert(response);
      //   },
      //   (error) => {
      //     console.error('File upload failed', error);
      //     return;
      //   }
      // );
    }
  }
  onRemove(event: FileRemoveEvent): void {
    // const index = this.selectedFiles.indexOf(event.file);
    // this.uploadedFiles = this.uploadedFiles.filter((element) => {
    //   if (element.name === event.file.name && element._id) {
    //     this.deleteFiles.push(this._id);
    //   }
    //   return element.name !== event.file.name;
    // });

    // if (index !== -1) {
    //   this.selectedFiles.splice(index, 1);
    // }
    this.onRemoveBin(event.file.name);
  }
  onRemoveBin(filename: string): void {
    this.selectedFiles = this.selectedFiles.filter((element) => {
      return element.name !== filename;
    });
    this.uploadedFiles = this.uploadedFiles.filter((element) => {
      if (element.name === filename && element.image && element.image._id) {
        this.deleteFiles.push(element.image);
        // alert(element.image._id);
      }
      return element.name !== filename;
    });
  }

  triggerHideDialog() {
    this.eventEmitterService.triggerHideDialog();
  }
  confirmPosition(position: string) {
    this.confirmationService.confirm({
      message:
        'Maximum 4 Images are allowed to Upload. The first four images will be Uploaded?',
      header: 'Image Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // User clicked "Yes" or "OK"

        return true;
      },
      reject: (type: ConfirmEventType) => {
        // User clicked "No" or rejected

        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
      key: 'positionDialog',
    });
    return false;
  }
  onClose(): void {
    // this.nextClicked.emit('exit');

    this.triggerHideDialog();
  }
  onSave(): void {
    // Custom upload logic
    if (this.selectedFiles.length > 4) {
      if (!this.confirmPosition('top')) {
        return;
      }
    }
    if (this.deleteFiles.length > 0) {
      // alert('yes delet');
      this.imageService.deletMany(this._id, this.deleteFiles).subscribe(
        (response) => {
          console.log('Files uploaded successfully', response);
          this.messageService.add({
            severity: 'info',
            summary: 'Uploaded',
            detail: 'Image Uploaded',
          });
          this.eventEmitterService.triggerReload();
        },
        (error) => {
          console.error('File upload failed', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'Failed to Remove',
          });
        }
      );
    }
    if (this.selectedFiles.length > 0) {
      this.imageService.uploadImages(this._id, this.selectedFiles).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Uploaded',
            detail: 'Image Uploaded',
          });
          console.log('Files uploaded successfully', response);
          this.selectedFiles = [];
          this.previews = [];
          this.fileUpload.clear();
          this.nextClicked.emit('exit');
          this.triggerHideDialog();
          this.eventEmitterService.triggerReload();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'Failed to upload',
          });
          // this.triggerHideDialog();
          console.error('File upload failed', error);
        }
      );
    } else {
      // this.eventEmitterService.triggerReload();

      this.triggerHideDialog();
    }
  }
}
