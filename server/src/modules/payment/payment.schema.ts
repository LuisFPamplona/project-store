import { z } from "zod";

export const paymentCardSchema = z.object({
  holderName: z.string().min(1, "Name must be provided"),
  cardNumber: z.number().min(16, "Invalid card number format"),
  expiration: z.number().min(6, "Invalid expiration format"),
  cvv: z.number().min(3, "Invalid security code format"),
});
