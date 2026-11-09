import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy} from "passport-jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private usersService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui',
        });
    }

    // Confirma que o usuário do token ainda existe e usa o role atual do banco
    async validate(payload: any){
        try {
            const user = await this.usersService.findByid(payload.sub);
            return { userId: user.id, email: user.email, role: user.role };
        } catch (error) {
            if(error instanceof NotFoundException){
                throw new UnauthorizedException('Usuário não encontrado');
            }
            throw error;
        }
    }
}
