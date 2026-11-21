import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { StaffGuard } from './staff.guard';

function fakeContext(request: object): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('StaffGuard', () => {
  const guard = new StaffGuard();

  it('deja pasar al personal', () => {
    const context = fakeContext({ user: { id: 1, role: 'staff' } });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('no deja pasar a un socio', () => {
    const context = fakeContext({ user: { id: 1, role: 'member' } });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('da 401 si el usuario del token ya no existe', async () => {
    const fakeJwt = { verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }) };
    const fakeUsers = { findById: jest.fn().mockResolvedValue(undefined) };
    const authGuard = new AuthGuard(
      fakeJwt as unknown as JwtService,
      fakeUsers as unknown as UsersService,
    );
    const context = fakeContext({
      headers: { authorization: 'Bearer token' },
    });

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
