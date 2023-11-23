import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { ImageUploadService } from 'src/app/services/image-upload.service';

@Component({
  selector: 'app-create-product-step-two',
  templateUrl: './create-product-step-two.component.html',
  styleUrls: ['./create-product-step-two.component.css'],
})
export class CreateProductStepTwoComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  selectedCities!: String[];
  uploadedFiles: any[] = [];
  selectedFiles: File[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];
  imageInfos?: Observable<any>;

  _id: String = '655e29a4dd41906e7e85e84e';
  constructor(private imageService: ImageUploadService) {}
  onFileUpload(event: any): void {
    for (const file of event.files) {
      this.selectedFiles.push(file);
    }
  }
  onRemove(event: FileRemoveEvent): void {
    const index = this.selectedFiles.indexOf(event.file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
  }
  onSave(): void {
    console.error(this.selectedFiles);
    // Custom upload logic
    this.imageService
      .uploadImages('655e29a4dd41906e7e85e84e', this.selectedFiles)
      .subscribe(
        (response) => {
          console.log('Files uploaded successfully', response);
          this.selectedFiles = [];
          this.previews = [];
          this.fileUpload.clear();
        },
        (error) => {
          console.error('File upload failed', error);
        }
      );
  }
}
