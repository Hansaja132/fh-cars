import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminRepository } from '../repositories/admin.repository';
import { env } from '../config/env';
import { AppError } from '../middleware/error-handler';

export class AuthService {
  private adminRepo = new AdminRepository();

  async login(email: string, password: string) {
    const user = await this.adminRepo.findByEmail(email);

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    await this.adminRepo.updateLastLogin(user.id);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    await this.adminRepo.createAuditLog({
      adminUserId: user.id,
      action: 'LOGIN',
      entityType: 'AUTH',
      details: `User ${user.email} logged in successfully`,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(userId: number) {
    const user = await this.adminRepo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user;
  }
}
