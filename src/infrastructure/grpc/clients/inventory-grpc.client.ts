import { Injectable } from '@nestjs/common';

export interface ReserveStockRequest {
  sku: string;
  quantity: number;
  orderId: string;
}

export interface ReserveStockResponse {
  reservationId: string;
  sku: string;
  quantity: number;
  expiresAt: Date;
}

export interface ReleaseReservationRequest {
  reservationId: string;
}

@Injectable()
export class InventoryGrpcClient {
  async reserveStock(request: ReserveStockRequest): Promise<ReserveStockResponse> {
    return {
      reservationId: `res-${Date.now()}`,
      sku: request.sku,
      quantity: request.quantity,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
  }

  async releaseReservation(request: ReleaseReservationRequest): Promise<void> {
    return;
  }

  async checkAvailability(sku: string, quantity: number): Promise<boolean> {
    return true;
  }
}
