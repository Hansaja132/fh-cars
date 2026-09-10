import { Request, Response, NextFunction } from 'express';
import { BrandService } from '../services/brand.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class BrandController {
  private brandService = new BrandService();

  public getBrands = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const brands = await this.brandService.getBrands();
      return res.status(200).json({ data: brands });
    } catch (error) {
      next(error);
    }
  };

  public getBrandBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brand = await this.brandService.getBrandBySlug(req.params.slug);
      return res.status(200).json({ data: brand });
    } catch (error) {
      next(error);
    }
  };

  public createBrand = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const brand = await this.brandService.createBrand(req.body, req.user?.id);
      return res.status(201).json({ data: brand });
    } catch (error) {
      next(error);
    }
  };

  public updateBrand = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const brand = await this.brandService.updateBrand(id, req.body, req.user?.id);
      return res.status(200).json({ data: brand });
    } catch (error) {
      next(error);
    }
  };

  public deleteBrand = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await this.brandService.deleteBrand(id, req.user?.id);
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
