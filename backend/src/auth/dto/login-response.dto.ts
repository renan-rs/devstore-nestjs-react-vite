import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({ description: 'Token JWT (Bearer)' })
    access_token: string;
}
