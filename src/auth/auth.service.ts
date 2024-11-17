import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types/auth-response.type';
import { SignUpInput } from './dto/inputs/signup.input';
import { SignInInput } from './dto/inputs/signin.input';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async revalidate(user: User): Promise<AuthResponse> {
        const token = this.jwtService.sign({ id: user.id });

        return {
            user: user,
            token: token
        }
    }

    async signIn(signInInput: SignInInput): Promise<AuthResponse> {
        
        const user = await this.userService.findOneByEmail(signInInput.email);

        if (!bcrypt.compareSync(signInInput.password, user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ id: user.id });

        return {
            user: user,
            token: token
        }
    }

    async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
        const user = await this.userService.create(signUpInput);

        const token = this.jwtService.sign({ name: user.name });

        return {
            user: user,
            token: token
        }
    }

    async validateUser(id: string): Promise<User> {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new UnauthorizedException('Invalid Token');
        }
        delete user.password;

        return user;
    }
}
