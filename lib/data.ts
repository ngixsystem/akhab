import { prisma } from "./prisma";

export async function getStoreSettings() {
  return prisma.storeSetting.findUnique({ where: { id: 1 } });
}

export async function getPublicSuppliers() {
  return prisma.supplier.findMany({
    where: {
      isActive: true,
      products: {
        some: {
          isActive: true
        }
      }
    },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true }
          }
        }
      }
    },
    orderBy: { name: "asc" }
  });
}

export async function getSupplierBySlug(slug: string) {
  return prisma.supplier.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true }
          }
        }
      }
    }
  });
}

export async function getPublicProducts(supplierSlug?: string | null) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      supplier: supplierSlug
        ? {
            slug: supplierSlug,
            isActive: true
          }
        : {
            isActive: true
          }
    },
    include: {
      supplier: true,
      inventory: true,
      attributes: {
        orderBy: { sortOrder: "asc" }
      }
    },
    orderBy: [{ supplier: { name: "asc" } }, { createdAt: "desc" }]
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      supplier: true,
      inventory: true,
      attributes: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });
}

export async function getDashboardData() {
  const [products, suppliers, orders, notifications, inventory, latestOrders] = await Promise.all([
    prisma.product.count(),
    prisma.supplier.count(),
    prisma.order.count(),
    prisma.notification.count({ where: { isRead: false } }),
    prisma.inventory.aggregate({
      _sum: {
        available: true,
        reserved: true
      }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true }
    })
  ]);

  return {
    products,
    suppliers,
    orders,
    notifications,
    inventory,
    latestOrders
  };
}

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: {
      supplier: true,
      inventory: true,
      attributes: {
        orderBy: { sortOrder: "asc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      supplier: true,
      inventory: true,
      attributes: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });
}

export async function getSuppliers() {
  return prisma.supplier.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: { name: "asc" }
  });
}

export async function getSupplierById(id: string) {
  return prisma.supplier.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true
        }
      }
    }
  });
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      items: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });
}

export async function getNotifications() {
  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

export async function getInventoryRows() {
  return prisma.product.findMany({
    include: {
      supplier: true,
      inventory: true
    },
    orderBy: { title: "asc" }
  });
}

export function toProductPayload(input: {
  slug: string;
  supplierId: string;
  companyName: string;
  productType: "REBAR" | "PROFILE";
  title: string;
  description: string;
  phone: string;
  telegram?: string | null;
  photos: string[];
  isActive: boolean;
  size?: string | null;
  length?: string | null;
  meterPerTon?: number | null;
  piecesPerTon?: number | null;
  pricePerTon?: number | null;
  pricePerPiece?: number | null;
  attributes: { key: string; value: string; sortOrder: number }[];
}) {
  const type = input.productType;

  return {
    slug: input.slug,
    supplierId: input.supplierId,
    companyName: input.companyName,
    productType: type,
    title: input.title,
    description: input.description,
    phone: input.phone,
    telegram: input.telegram || null,
    photos: input.photos,
    isActive: input.isActive,
    size: type === "REBAR" ? input.size || null : null,
    length: type === "REBAR" ? input.length || null : null,
    meterPerTon: type === "REBAR" && input.meterPerTon !== null && input.meterPerTon !== undefined ? input.meterPerTon : null,
    piecesPerTon: type === "REBAR" && input.piecesPerTon !== null && input.piecesPerTon !== undefined ? input.piecesPerTon : null,
    pricePerTon: type === "REBAR" && input.pricePerTon !== null && input.pricePerTon !== undefined ? input.pricePerTon : null,
    pricePerPiece: type === "REBAR" && input.pricePerPiece !== null && input.pricePerPiece !== undefined ? input.pricePerPiece : null
  };
}
