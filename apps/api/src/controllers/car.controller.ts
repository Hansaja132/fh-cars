import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/car.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class CarController {
  private carService = new CarService();

  public getCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.carService.getCars(req.query as any);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public searchCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = (req.query.q as string) || (req.query.search as string) || '';
      const result = await this.carService.searchCars(query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getCarById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const car = await this.carService.getCarById(id);
      return res.status(200).json({ data: car });
    } catch (error) {
      next(error);
    }
  };

  public getCarByOrdinal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ordinal = parseInt(req.params.ordinal, 10);
      const car = await this.carService.getCarByOrdinal(ordinal);
      return res.status(200).json({ data: car });
    } catch (error) {
      next(error);
    }
  };

  public createCar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const car = await this.carService.createCar(req.body, req.user?.id);
      return res.status(201).json({ data: car });
    } catch (error) {
      next(error);
    }
  };

  public updateCar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const car = await this.carService.updateCar(id, req.body, req.user?.id);
      return res.status(200).json({ data: car });
    } catch (error) {
      next(error);
    }
  };

  public deleteCar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await this.carService.deleteCar(id, req.user?.id);
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
