
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

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
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0,
        ssl: process.env.NODE_ENV === 'production',
        sslValidate: process.env.NODE_ENV === 'production',
      });

      this.isConnected = true;
      logger.info('✅ Database connected successfully');

      mongoose.connection.on('error', (error) => {
        logger.error('Database connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      logger.error('Failed to connect to database:', error);
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
