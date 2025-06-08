import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { UpdateUserDto } from './dto/create-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put()
  update(@CurrentUserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('/me')
  getMe(@CurrentUserId() userId: number) {
    return this.usersService.findById(userId);
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Delete()
  delete(@CurrentUserId() userId: number) {
    return this.usersService.delete(userId);
  }
}
