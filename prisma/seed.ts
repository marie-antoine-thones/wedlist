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
      title: "Honeymoon in Santorini",
      description:
        "Help us enjoy a magical week in Santorini, Greece! We dream of watching sunsets from Oia, swimming in crystal-clear waters, and exploring ancient ruins together.",
      imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
      categoryId: honeymoon.id,
      price: 3000,
      isGroupGift: true,
      targetAmount: 3000,
    },
    {
      title: "Romantic Dinner in Santorini",
      description: "A candlelit dinner overlooking the caldera with local wine and fresh seafood.",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      categoryId: honeymoon.id,
      price: 200,
      isGroupGift: true,
      targetAmount: 200,
    },
    {
      title: "KitchenAid Stand Mixer",
      description:
        "The iconic Artisan stand mixer in Pistachio. Perfect for baking together on lazy Sunday mornings.",
      imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&h=400&fit=crop",
      categoryId: kitchen.id,
      price: 450,
      isGroupGift: false,
      targetAmount: null,
    },
    {
      title: "Le Creuset Dutch Oven",
      description: "A beautiful 5.5-quart Dutch oven in Marseille blue. For cozy winter stews and Sunday roasts.",
      imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop",
      categoryId: kitchen.id,
      price: 350,
      isGroupGift: false,
      targetAmount: null,
    },
    {
      title: "Crystal Wine Glasses (Set of 6)",
      description: "Elegant Riedel crystal wine glasses for those special dinner parties and celebrations.",
      imageUrl: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&h=400&fit=crop",
      categoryId: kitchen.id,
      price: 180,
      isGroupGift: false,
      targetAmount: null,
    },
    {
      title: "Espresso Machine",
      description: "A Breville Barista Express for perfect morning espressos. Because life's too short for bad coffee.",
      imageUrl: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=400&fit=crop",
      categoryId: kitchen.id,
      price: 600,
      isGroupGift: true,
      targetAmount: 600,
    },
    {
      title: "Luxury Bed Linen Set",
      description: "Egyptian cotton 400TC bed linen set in crisp white. For the sweetest dreams in our new home.",
      imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
      categoryId: home.id,
      price: 280,
      isGroupGift: false,
      targetAmount: null,
    },
    {
      title: "Smart Home Starter Kit",
      description: "Philips Hue lights, smart thermostat, and a voice assistant to make our home cozy and connected.",
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
      categoryId: home.id,
      price: 400,
      isGroupGift: true,
      targetAmount: 400,
    },
    {
      title: "Cooking Class for Two",
      description: "A private Italian cooking class where we'll learn to make fresh pasta and tiramisu together.",
      imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
      categoryId: experiences.id,
      price: 150,
      isGroupGift: false,
      targetAmount: null,
    },
    {
      title: "Spa Day for Two",
      description: "A full day of relaxation with massages, facials, and champagne. Pure bliss after the wedding!",
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
      categoryId: experiences.id,
      price: 250,
      isGroupGift: false,
      targetAmount: null,
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
      title: "Future Adventures Fund",
      description:
        "For all the trips, experiences, and surprises life has in store. Help us build a treasure chest of memories!",
      imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      categoryId: cashFunds.id,
      price: 2000,
      isGroupGift: true,
      targetAmount: 2000,
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
