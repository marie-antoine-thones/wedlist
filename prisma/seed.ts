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
      weddingDate: new Date("2026-04-10"),
      personalMessage:
        "Nous sommes heureux de vous compter parmi les invités de notre mariage. Si vous souhaitez nous offrir un cadeau, voici quelques idées qui pourraient vous inspirer.",
      heroImageUrl: "/hero.jpg",
      bankAccountHolder: "Marie et Antoine",
      bankIBAN: "FR76 1020 7000 2623 1918 7501 383",
      bankBIC: "CCBPFRPPMTG",
      bankName: "BP RIVES DE PARIS",
      adminPasswordHash: passwordHash,
      siteToken: "mariage-marie-antoine",
    },
  });

  // Create categories
  const honeymoon = await prisma.category.create({
    data: { name: "Voyage de noces", slug: "honeymoon", icon: "✈️", sortOrder: 1 },
  });
  const kitchen = await prisma.category.create({
    data: { name: "Cuisine", slug: "kitchen", icon: "🍳", sortOrder: 2 },
  });
  const home = await prisma.category.create({
    data: { name: "Maison", slug: "home", icon: "🏠", sortOrder: 3 },
  });
  const don = await prisma.category.create({
    data: { name: "Don", slug: "don", icon: "💝", sortOrder: 5 },
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
      imageUrl: "https://static01.galaxus.com/productimages/5/3/0/5/7/6/9/6/1/0/7/9/9/9/3/8/6/1/5/71f42093-3af5-409e-9d3f-6624660bdd2e_cropped.jpg_720.jpeg",
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
      imageUrl: "https://images.ctfassets.net/8cd2csgvqd3m/5ffQPWX2hMWg1Lcvv4Ndmh/715d29139574b6992a7db3b00ff04053/A9_Gold_1_Resized.png?q=90&fm=webp&w=1440&h=1440&fit=fill",
      categoryId: home.id,
      price: 3800,
      isGroupGift: true,
      targetAmount: 3800,
    },
    {
      title: "Carafe",
      description: "",
      imageUrl: "https://media.madeindesign.com/cdn-cgi/image/fit=pad,format=auto,width=1000,height=1000,quality=70/nuxeo/products/e/3/carafe-festivo-bleu-klevering_madeindesign_1758702066_original.jpg",
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
      imageUrl: "https://www.hagengrote.fr/$WS/hg1ht/websale8_shop-hg1ht/produkte/medien/bilder/normal/Cocotte-ovale-Le-Creuset-avec-couvercle-31-cm-_-035b07b.jpg",
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
      title: "Don à Greenpeace",
      description:
        "",
      imageUrl: "https://www.grainepaca.org/wp-content/uploads/2018/03/greenpeace-logo.jpg",
      categoryId: don.id,
      price: 1000000,
      isGroupGift: true,
      targetAmount: 1000000,
    },
    {
      title: "Coupes à champagne",
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
