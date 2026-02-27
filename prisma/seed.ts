import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

function createPrisma() {
  if (process.env.TURSO_DATABASE_URL) {
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    return new PrismaClient({
      adapter: new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    });
  }
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    }),
  });
}

const prisma = createPrisma();

async function main() {
  // Clear existing data
  await prisma.contribution.deleteMany();
  await prisma.giftItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.settings.deleteMany();

  // Create settings
  const passwordHash = await bcrypt.hash("wedding2026", 12);
  await prisma.settings.create({
    data: {
      coupleName1: "Marie",
      coupleName2: "Antoine",
      weddingDate: new Date("2026-09-12"),
      personalMessage:
        "We are so happy to celebrate our love with you! Your presence is the greatest gift, but if you'd like to contribute to our new life together, here are some ideas we'd love.",
      heroImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop",
      bankAccountHolder: "Marie & Antoine Dupont",
      bankIBAN: "FR76 1234 5678 9012 3456 7890 123",
      bankBIC: "BNPAFRPP",
      bankName: "BNP Paribas",
      adminPasswordHash: passwordHash,
      siteToken: "our-beautiful-wedding",
    },
  });

  // Create categories
  const honeymoon = await prisma.category.create({
    data: { name: "Honeymoon", slug: "honeymoon", icon: "✈️", sortOrder: 1 },
  });
  const kitchen = await prisma.category.create({
    data: { name: "Kitchen", slug: "kitchen", icon: "🍳", sortOrder: 2 },
  });
  const home = await prisma.category.create({
    data: { name: "Home", slug: "home", icon: "🏠", sortOrder: 3 },
  });
  const experiences = await prisma.category.create({
    data: { name: "Experiences", slug: "experiences", icon: "🎉", sortOrder: 4 },
  });
  const cashFunds = await prisma.category.create({
    data: { name: "Cash Funds", slug: "cash-funds", icon: "💝", sortOrder: 5 },
  });

  // Create gift items
  const gifts = [
    {
      title: "Voyage de noces dans les Dolomites",
      description:
        "",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQleovsyhq6lenOKpNf65x7H_3COXB9aOf1Jw&s",
      categoryId: honeymoon.id,
      price: 5000,
      isGroupGift: true,
      targetAmount: 5000,
    },
    {
      title: "Vase",
      description: "",
      imageUrl: "https://images.urbndata.com/is/image/UrbanOutfitters/53794442_072_d?$xlarge$&fit=constrain&fmt=webp&qlt=80&wid=960",
      categoryId: home.id,
      price: 89,
      isGroupGift: true,
      targetAmount: 89,
    },
    {
      title: "Lampe de table",
      description:
        "",
      imageUrl: "https://www.silvera.fr/media/cache/resolve/product_medium_thumbnail_image_2xl/product_17620_80007_flowerpot-vp9-sans-fil.jpg",
      categoryId: home.id,
      price: 188,
      isGroupGift: true,
      targetAmount: 188,
    },
    {
      title: "Tapis en laine",
      description: "",
      imageUrl: "https://cdn.laredoute.com/cdn-cgi/image/width=500,height=500,fit=pad,dpr=1/products/1/9/1/191ebc3ab15d4f0a5f9e6d3c1d5dc180.jpg",
      categoryId: home.id,
      price: 360,
      isGroupGift: true,
      targetAmount: 360,
    },
    {
      title: "Bougie",
      description: "",
      imageUrl: "https://hudsongracesf.com/cdn/shop/products/Cire_Trudon_Red.jpg?v=1728418122&width=416",
      categoryId: home.id,
      price: 50,
      isGroupGift: true,
      targetAmount: 50,
    },
    {
      title: "Enceintes audio",
      description: "",
      imageUrl: "https://m.media-amazon.com/images/I/91+w6JgdWXL._AC_UF1000,1000_QL80_.jpg",
      categoryId: home.id,
      price: 1150,
      isGroupGift: true,
      targetAmount: 1150,
    },
    {
      title: "Carafe",
      description: "",
      imageUrl: "https://cdn.laredoute.com/cdn-cgi/image/width=500,height=500,fit=pad,dpr=1/products/e/f/7/ef7784d878aac1f0e4add494fd8eaa4c.jpg",
      categoryId: kitchen.id,
      price: 150,
      isGroupGift: true,
      targetAmount: 150,
    },
    {
      title: "Couverts",
      description: "",
      imageUrl: "https://sabre-paris.com/cdn/shop/files/0238-033-0009-1.jpg?v=1770241678&width=832",
      categoryId: kitchen.id,
      price: 400,
      isGroupGift: true,
      targetAmount: 400,
    },
    {
      title: "Cocotte en fonte",
      description: "",
      imageUrl: "https://www.lecreuset.fr/dw/image/v2/BDSR_PRD/on/demandware.static/-/Sites-master-catalog-LC/default/dw26d8345c/images/beaverHires/FULL_HD_PNG/20240321_GS_21177300902430_100.png?sw=765&sh=575&sm=fit",
      categoryId: kitchen.id,
      price: 569,
      isGroupGift: true,
      targetAmount: 569,
    },
    {
      title: "Assiettes à dessert",
      description: "",
      imageUrl: "https://www.gien.com/cdn/shop/files/Assiettes-dessert-assorties-L_archipel-sentimental.png?v=1766417204&width=816",
      categoryId: kitchen.id,
      price: 250,
      isGroupGift: true,
      targetAmount: 250,
    },
    {
      title: "New Home Fund",
      description:
        "Help us furnish and decorate our first home together. Every contribution brings us closer to making it ours.",
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      categoryId: cashFunds.id,
      price: 5000,
      isGroupGift: true,
      targetAmount: 5000,
    },
    {
      title: "Coupes a champagne",
      description:
        "",
      imageUrl: "https://fermliving.com/cdn/shop/files/336115_5444_1.png?v=1762182928&width=1000",
      categoryId: kitchen.id,
      price: 195,
      isGroupGift: true,
      targetAmount: 195,
    },
    {
      title: "Théière",
      description:
        "",
      imageUrl: "https://thesouthernatelier.com/cdn/shop/files/the-southern-atelier-elegant-glass-teapot-and-cup-ensemble-for-a-sophisticated-tea-experiencesku-1763119149506-534-1312467.webp?v=1765487607&width=713",
      categoryId: kitchen.id,
      price: 40,
      isGroupGift: true,
      targetAmount: 40,
    },
  ];

  for (let i = 0; i < gifts.length; i++) {
    await prisma.giftItem.create({
      data: { ...gifts[i], sortOrder: i + 1 },
    });
  }

  // Add some sample contributions
  const santorini = await prisma.giftItem.findFirst({
    where: { title: "Honeymoon in Santorini" },
  });
  if (santorini) {
    await prisma.contribution.create({
      data: {
        giftItemId: santorini.id,
        guestName: "Grandma Jeanne",
        amount: 500,
        message: "For the most beautiful couple! Enjoy every moment! 💕",
        isConfirmed: true,
      },
    });
    await prisma.contribution.create({
      data: {
        giftItemId: santorini.id,
        guestName: "Uncle Pierre & Aunt Sophie",
        amount: 300,
        message: "Wishing you a wonderful honeymoon!",
        isConfirmed: true,
      },
    });
  }

  const homeFund = await prisma.giftItem.findFirst({
    where: { title: "New Home Fund" },
  });
  if (homeFund) {
    await prisma.contribution.create({
      data: {
        giftItemId: homeFund.id,
        guestName: "The Martin Family",
        amount: 200,
        message: "Can't wait to visit your new place!",
        isConfirmed: false,
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
