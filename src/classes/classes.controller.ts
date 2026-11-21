import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { ListClassesQueryDto } from './dto/list-classes-query.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  findAll(@Query('activity') activity?: string) {
    return this.classesService.findAll(activity);
  }

  @Get()
  @Version('2')
  findPage(@Query() query: ListClassesQueryDto) {
    return this.classesService.findPage(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, StaffGuard)
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, StaffGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
