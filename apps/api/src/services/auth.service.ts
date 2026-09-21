import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminRepository } from '../repositories/admin.repository';
import { MailService } from './mail.service';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../middleware/error-handler';

export class AuthService {
  private adminRepo = new AdminRepository();
  private mailService = new MailService();

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

    // Send security alert notification email to user
    this.mailService.sendLoginNotification(user.email, new Date()).catch((err) => {
      console.error('Failed to dispatch login notification email:', err);
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

  async requestPasswordReset(email: string) {
    const user = await this.adminRepo.findByEmail(email);
    if (!user || !user.isActive) {
      return { message: 'If an active account exists with that email, a verification code has been sent.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email,
        code,
        expiresAt,
        used: false,
      },
    });

    await this.mailService.sendVerificationCode(email, code);

    return { message: 'If an active account exists with that email, a verification code has been sent.' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetToken) {
      throw new AppError('Invalid or expired verification code', 400, 'INVALID_RESET_CODE');
    }

    const user = await this.adminRepo.findByEmail(email);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    await this.adminRepo.createAuditLog({
      adminUserId: user.id,
      action: 'PASSWORD_RESET',
      entityType: 'AUTH',
      details: `Password reset successfully via verification code for ${user.email}`,
    });

    return { message: 'Password has been reset successfully. You can now log in with your new password.' };
  }
}
