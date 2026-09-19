import { z } from "zod";

// Bangladesh 64 Districts List
export const BD_DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
  "Cumilla",
  "Brahmanbaria",
  "Bogura",
  "Cox's Bazar",
  "Dinajpur",
  "Feni",
  "Jessore",
  "Kushtia",
  "Noakhali",
  "Pabna",
  "Tangail",
] as const;

// Bangladesh phone number regex: accepts 1[3-9]\d{8}, 01[3-9]\d{8}, or +8801[3-9]\d{8}
export const BD_PHONE_REGEX = /^(?:\+8801|01|1)[3-9]\d{8}$/;

export const checkoutSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  city: z.string().optional(),
  zone: z.enum(["inside-dhaka", "outside-dhaka"]),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  deliveryNote: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
  
  // Payment
  paymentMethod: z.enum(["cod", "bkash", "nagad", "upay", "card"]),
  mfsNumber: z.string().optional(),
  trxId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (["bkash", "nagad", "upay"].includes(data.paymentMethod)) {
    if (!data.mfsNumber || !BD_PHONE_REGEX.test(data.mfsNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter valid 11-digit sender wallet number",
        path: ["mfsNumber"],
      });
    }
    if (!data.trxId || data.trxId.trim().length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter valid Transaction ID (TrxID)",
        path: ["trxId"],
      });
    }
  }
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
