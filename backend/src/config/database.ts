
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        logger.info('Database already connected');
        return;
      }

      const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/udaan_agencies';

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      logger.info('✅ Database connected successfully');

      mongoose.connection.on('error', (error) => {
        logger.error({ err: error }, 'Database connection error');
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      logger.error({ err: error }, 'Failed to connect to database');
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Database disconnected');
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const dbConnection = DatabaseConnection.getInstance();
