import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    JwtModule.register({
      privateKey: fs.readFileSync(
        path.join(__dirname, '../../private.key'),
        'utf8',
      ),
      publicKey: fs.readFileSync(
        path.join(__dirname, '../../public.key'),
        'utf8',
      ),
      signOptions: { algorithm: 'RS256' },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
