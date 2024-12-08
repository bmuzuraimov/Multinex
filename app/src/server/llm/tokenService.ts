import { TiktokenModel, encoding_for_model } from 'tiktoken';

export class TokenService {
  static calculateRequiredTokens(content: string, model: TiktokenModel): number {
    const encoding = encoding_for_model(model);
    return encoding.encode(content).length;
  }

  static async deductTokens(context: any, totalTokens: number): Promise<void> {
    await context.entities.User.update({
      where: { id: context.user.id },
      data: {
        tokens: {
          decrement: totalTokens,
        },
      },
    });
  }
}
