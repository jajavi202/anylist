import { Mutation, Resolver } from '@nestjs/graphql';
import { SharedService } from './shared.service';

@Resolver()
export class SharedResolver {
    constructor(
        private readonly sharedService: SharedService
    ) {}

    @Mutation(() => Boolean, { name: 'executeSeed' })
    async executeSeed(): Promise<boolean> {
        return await this.sharedService.seed();
    }
}
