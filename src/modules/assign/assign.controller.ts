import { SwaggerBadRequestResponse } from '@/errors/bad-request-response';
import { SwaggerConflictResponse } from '@/errors/conflict-response';
import { SwaggerNotFoundResponse } from '@/errors/not-found-response';
import { Controller, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AssignService } from './assign.service';

@ApiTags('Assign')
@Controller('assign')
export class AssignController {
  constructor(private readonly assignService: AssignService) {}

  @ApiOperation({
    summary: 'Assigns a user to a class',
    description: 'Assigns a user to a class on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User assigned to a class successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'User already assigned to a class',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post('link/:userId/class/:classId')
  assignUserToClass(
    @Param('userId') userId: string,
    @Param('classId') classId: string,
  ) {
    return this.assignService.assignUserToClass(userId, classId);
  }

  @ApiOperation({
    summary: 'Assigns a user to a class',
    description: 'Assigns a user to a class on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User assigned to a class successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 409,
    description: 'User already not assigned to a class',
    type: SwaggerNotFoundResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post('unlink/:userId/class/:classId')
  unassignUserToClass(
    @Param('userId') userId: string,
    @Param('classId') classId: string,
  ) {
    return this.assignService.unassignUserToClass(userId, classId);
  }
}
