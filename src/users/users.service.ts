import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from 'src/auth/dto/inputs/signup.input';
import { AS001, AS001_MESSAGE } from 'src/resources/error-codes/users-service.errors';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signUpInput,
        password: await bcrypt.hashSync(signUpInput.password, 10)
      });
      return await this.userRepository.save(newUser);
    }
    catch (err) {
      this.handleDBError(err);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    }
    catch (err) {
      this.handleDBError(err);
    }
  }

  async findAll(validRoles: ValidRoles[]): Promise<User[]> {
    try {
      if (validRoles.length == 0) {
        return await this.userRepository.find({
          relations: ['updateActionUser']
        });
      }
      return await this.userRepository.createQueryBuilder()
      .where('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', validRoles)
      .getMany();
    }
    catch (err) {
      this.handleDBError(err);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email }); 
    }
    catch (err) {
      this.handleDBError({code: AS001, details: `${AS001_MESSAGE}: ${email}`});
    }
  }

  async block(id: string, user: User): Promise<User> {
    try {
      const updateActionUser = await this.userRepository.findOneByOrFail({ id: user.id });

      const _user = await this.userRepository.findOneByOrFail({ id });
      _user.isActive = false;
      _user.updateActionUser = updateActionUser;
      return await this.userRepository.save(_user);
    }
    catch (err) {
      this.handleDBError(err);
    }
  }

  async update(updateUserInput: UpdateUserInput, user: User): Promise<User> {
    try {
      const _user = await this.userRepository.findOneByOrFail({ id: updateUserInput.id });
      _user.updateActionUser = user;
      //ACTUALIZA EL USUARIO EN EL GUARDADO, LA OTRA OPCION ES CON PRELOAD
      //  PERO DE ESTA FORMA VERIFICA QUE EXISTA ANTES
      return await this.userRepository.save({
        ..._user,
        ...updateUserInput
      });
    }
    catch (err) {
      this.handleDBError(err);
    }
  }
  
  //#region Private Methods

  private handleDBError(err: any): never {
    if (err.code === AS001) {
      this.logger.error(err.details);
      throw new NotFoundException({ message: err.details });
    }
    this.logger.error(err);
    throw new InternalServerErrorException('Check Logs');
  }
  //#endregion

}
