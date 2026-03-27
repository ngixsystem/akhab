import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin12345", 10);

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@planner.local" },
    update: {
      passwordHash,
      name: "METIS Admin"
    },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@planner.local",
      passwordHash,
      name: "METIS Admin"
    }
  });

  await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "METIS Metal Supply",
      phone: "+998 90 000 00 00",
      telegram: "@metis_metal",
      address: "Ташкент, промышленная зона",
      heroTitle: "Металлопрокат для стройки и производства",
      heroSubtitle: "Арматура и профиль с понятными остатками, актуальными ценами и быстрым подтверждением заказов.",
      aboutText: "Поставляем металл для строительных площадок, производственных компаний и подрядчиков. Держим в фокусе скорость отгрузки, прозрачные остатки и стабильную коммуникацию."
    }
  });

  const rebar = await prisma.product.upsert({
    where: { slug: "armatura-a500c-12mm" },
    update: {},
    create: {
      slug: "armatura-a500c-12mm",
      companyName: "METIS Metal Supply",
      productType: "REBAR",
      title: "Арматура A500C 12 мм",
      description: "Надежная арматура для монолитных работ, частного и коммерческого строительства.",
      phone: "+998 90 000 00 00",
      telegram: "@metis_metal",
      photos: ["/uploads/demo-rebar.svg"],
      isActive: true,
      size: "12 мм",
      length: "11.7 м",
      meterPerTon: "1126.00",
      piecesPerTon: "96.00",
      pricePerTon: "7800000.00",
      pricePerPiece: "81250.00"
    }
  });

  await prisma.inventory.upsert({
    where: { productId: rebar.id },
    update: {},
    create: {
      productId: rebar.id,
      inStock: 120,
      reserved: 8,
      available: 112
    }
  });

  const profile = await prisma.product.upsert({
    where: { slug: "profil-truba-40x20x2" },
    update: {},
    create: {
      slug: "profil-truba-40x20x2",
      companyName: "METIS Metal Supply",
      productType: "PROFILE",
      title: "Профильная труба 40x20x2",
      description: "Универсальный профиль для каркасных конструкций, навесов и производственных проектов.",
      phone: "+998 90 000 00 00",
      telegram: "@metis_metal",
      photos: ["/uploads/demo-profile.svg"],
      isActive: true
    }
  });

  await prisma.productAttribute.createMany({
    data: [
      { productId: profile.id, key: "Сечение", value: "40x20 мм", sortOrder: 1 },
      { productId: profile.id, key: "Толщина стенки", value: "2 мм", sortOrder: 2 },
      { productId: profile.id, key: "Длина", value: "6 м", sortOrder: 3 }
    ],
    skipDuplicates: true
  });

  await prisma.inventory.upsert({
    where: { productId: profile.id },
    update: {},
    create: {
      productId: profile.id,
      inStock: 75,
      reserved: 5,
      available: 70
    }
  });

  const existingOrder = await prisma.order.findFirst({ where: { customerName: "ООО Beton Stroy" } });

  if (!existingOrder) {
    const order = await prisma.order.create({
      data: {
        customerName: "ООО Beton Stroy",
        phone: "+998 90 111 22 33",
        telegram: "@beton_manager",
        comment: "Нужна оперативная отгрузка до конца недели.",
        status: "NEW",
        items: {
          create: [
            {
              productId: rebar.id,
              quantity: 10,
              productTitle: rebar.title,
              productSlug: rebar.slug,
              productTypeLabel: "арматура",
              unitPrice: "81250.00"
            }
          ]
        }
      }
    });

    await prisma.notification.create({
      data: {
        type: "NEW_ORDER",
        title: "Новый заказ",
        message: `Поступил новый заказ от ${order.customerName}.`,
        metadata: { orderId: order.id }
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
