import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/car.service';

export class LookupController {
  private carService = new CarService();

  public getClasses = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const classes = await this.carService.getDistinctValues('class');
      return res.status(200).json({ data: classes });
    } catch (error) {
      next(error);
    }
  };

  public getDrivetrains = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const drivetrains = await this.carService.getDistinctValues('drivetrain');
      return res.status(200).json({ data: drivetrains });
    } catch (error) {
      next(error);
    }
  };

  public getCarTypes = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const types = await this.carService.getDistinctValues('carType');
      return res.status(200).json({ data: types });
    } catch (error) {
      next(error);
    }
  };

  public getCountries = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await this.carService.getDistinctValues('country');
      return res.status(200).json({ data: countries });
    } catch (error) {
      next(error);
    }
  };

  public getStatistics = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.carService.getStatistics();
      return res.status(200).json({ data: stats });
    } catch (error) {
      next(error);
    }
  };
}
