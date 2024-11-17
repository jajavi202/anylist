import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Module({
    providers: [
        {
            provide: 'PUB_SUB',
            useValue: pubSub,
        },
    ],
    exports: ['PUB_SUB'],
})
export class SharedModule {}
