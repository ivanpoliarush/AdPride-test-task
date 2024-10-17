import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { CreateProjectDto } from '../dto/create-project.dto';
import { User } from 'src/decorators/user.decorator';
import { UserPayload } from 'src/auth/types/user-payoad';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { GetProjectsDto } from '../dto/get-projects.dto';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  async getProjects(@User() user: UserPayload, @Query() query: GetProjectsDto) {
    const projects = await this.projectService.getProjects(
      user.sub,
      {
        limit: +query.limit,
        offset: +query.offset,
      },
      query.search,
    );

    return projects;
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
