import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ProjectListResponse } from '../dto/project-list-response.dto';
import { Project } from '@prisma/client';
import { CreateProjectDto } from '../dto/create-project.dto';
import { User } from 'src/decorators/user.decorator';
import { UserPayload } from 'src/auth/types/user-payoad';
import { UpdateProjectDto } from '../dto/update-project.dto';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(@Request() req): Promise<ProjectListResponse> {
    const userId = req.user.sub as number;

    const list: Project[] = await this.projectService.findMany({
      where: { userId },
    });

    return list.map((x: Project) => ({
      id: x.id,
      name: x.name,
      url: x.url,
      status: x.status,
      expiredAt: x.expiredAt,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    }));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createProject(
    @Body() project: CreateProjectDto,
    @User() user: UserPayload,
  ) {
    const id = await this.projectService.createProject(project, user.sub);
    return { id };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updatePorject(
    @Body() project: UpdateProjectDto,
    @Param('id') id: string,
    @User() user: UserPayload,
  ) {
    await this.projectService.updateProject(project, +id, user.sub);
    return { message: 'OK' };
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string, @User() user: UserPayload) {
    await this.projectService.deleteProject(+id, user.sub);
    return { message: 'OK' };
  }
}
