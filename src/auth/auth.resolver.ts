import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { SignUpInput } from './dto/inputs/signup.input';
import { SignInInput } from './dto/inputs/signin.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { ValidRoles } from './enums/valid-roles.enum';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService, @Inject('PUB_SUB') private pubSub: PubSub) {}

  @Mutation(() => AuthResponse , { name: 'signUp' })
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput
  ): Promise<AuthResponse> {
    return await this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse , { name: 'signIn' })
  async signIn(
    @Args('signInInput') signInInput: SignInInput
  ): Promise<AuthResponse> {
    const output = await this.authService.signIn(signInInput);
    this.pubSub.publish('subTest',  output.user );
    return output;    
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards( JwtAuthGuard )
  async revalidateToken(
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ): Promise<AuthResponse> {
    return await this.authService.revalidate(user);
  }
}
