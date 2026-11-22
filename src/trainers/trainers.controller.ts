import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { PhotosService } from './photos.service';
import { TrainersService } from './trainers.service';

const photoPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 2 * 1024 * 1024,
      message: 'La imagen no puede pasar de 2 MB',
    }),
    new FileTypeValidator({ fileType: /^image\/(png|jpeg|webp)$/ }),
  ],
});

@Controller('trainers')
export class TrainersController {
  constructor(
    private readonly trainersService: TrainersService,
    private readonly photosService: PhotosService,
  ) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trainersService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, StaffGuard)
  create(@Body() dto: CreateTrainerDto) {
    return this.trainersService.create(dto);
  }

  @Post(':id/photo')
  @UseGuards(AuthGuard, StaffGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(photoPipe) file: Express.Multer.File,
  ) {
    await this.trainersService.findOne(id);
    const photoUrl = await this.photosService.saveLocal(file);
    return this.trainersService.setPhoto(id, photoUrl);
  }
}
