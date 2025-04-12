export class RemoveItemFromCartCommand {
  constructor(
    public readonly userId: number,
    public readonly productId: number,
  ) {}
}
