import { Response, NextFunction } from 'express';
import { ImportService } from '../services/import.service';
import { AdminRepository } from '../repositories/admin.repository';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error-handler';

export class AdminController {
  private importService = new ImportService();
  private adminRepo = new AdminRepository();

  public importCars = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      let content = '';
      let fileType: 'json' | 'csv' = 'json';

      if (req.is('json')) {
        content = JSON.stringify(req.body);
        fileType = 'json';
      } else if (req.is('text/csv') || req.is('text/plain') || typeof req.body === 'string') {
        content = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        fileType = 'csv';
      } else if (req.body && req.body.content) {
        content = req.body.content;
        fileType = req.body.fileType === 'csv' ? 'csv' : 'json';
      } else {
        content = JSON.stringify(req.body);
      }

      if (!content || content.trim().length === 0) {
        throw new AppError('Import payload is empty', 400, 'BAD_REQUEST');
      }

      const summary = await this.importService.importCars(content, fileType, req.user?.id);
      return res.status(200).json({ data: summary });
    } catch (error) {
      next(error);
    }
  };

  public getAuditLogs = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const logs = await this.adminRepo.findAuditLogs(100);
      return res.status(200).json({ data: logs });
    } catch (error) {
      next(error);
    }
  };
}
