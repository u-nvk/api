export interface OrdersTable {
  id: string;
  driverPid: string;
  routeId: string;
  price: number;
  transportId: string;
  startFreeSeatCount: number;
  timeStart: string;
}
