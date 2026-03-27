import { z } from "zod";

const orderStatusEnum = z.enum([
  "NEW",
  "PROCESSING",
  "CONFIRMED",
  "PICKING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED"
]);

const productTypeEnum = z.enum(["REBAR", "PROFILE"]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const productAttributeSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  sortOrder: z.number().int().min(0).default(0)
});

export const productSchema = z
  .object({
    slug: z.string().min(2),
    companyName: z.string().min(2),
    productType: productTypeEnum,
    title: z.string().min(2),
    description: z.string().min(10),
    phone: z.string().min(5),
    telegram: z.string().optional().nullable(),
    photos: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
    size: z.string().optional().nullable(),
    length: z.string().optional().nullable(),
    meterPerTon: z.coerce.number().optional().nullable(),
    piecesPerTon: z.coerce.number().optional().nullable(),
    pricePerTon: z.coerce.number().optional().nullable(),
    pricePerPiece: z.coerce.number().optional().nullable(),
    attributes: z.array(productAttributeSchema).default([])
  })
  .superRefine((value, ctx) => {
    if (value.productType === "REBAR") {
      if (!value.size) ctx.addIssue({ code: "custom", message: "Size is required for rebar.", path: ["size"] });
      if (!value.length) ctx.addIssue({ code: "custom", message: "Length is required for rebar.", path: ["length"] });
    }
  });

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1)
});

export const orderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(5),
  telegram: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1)
});

export const orderStatusSchema = z.object({
  status: orderStatusEnum,
  internalNotes: z.string().optional().nullable()
});

export const inventorySchema = z.object({
  inStock: z.number().int().min(0),
  reserved: z.number().int().min(0)
});

export const notificationSchema = z.object({
  isRead: z.boolean()
});

export const settingSchema = z.object({
  companyName: z.string().min(2),
  phone: z.string().min(5),
  telegram: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  heroTitle: z.string().min(4),
  heroSubtitle: z.string().min(10),
  aboutText: z.string().min(10)
});
