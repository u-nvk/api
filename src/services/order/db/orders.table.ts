export interface OrdersTable {
  id: string;
  driverPid: string;
  routeId: string;
  price: number;
  comment: string;
  transportId: string;
  startFreeSeatCount: number;
  timeStart: string;
  isDeclined: boolean;
}
