import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ example: 'Maria Silva' })
    name: string;

    @ApiProperty({ example: 'maria@devstore.com' })
    email: string;

    @ApiProperty({ enum: Role })
    role: Role;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
