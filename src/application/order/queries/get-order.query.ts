export class GetOrderQuery {
  constructor(
    public readonly orderId: number,
    public readonly userId?: number, // Опционально, для проверки прав доступа
  ) {}
}
