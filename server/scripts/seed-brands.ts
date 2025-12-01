import { PrismaService } from "src/shared/services/prisma.service";

const prisma = new PrismaService();

interface BrandData {
  name: string;
  logo: string;
  translations: {
    en: {
      name: string;
      description: string;
    };
    vi: {
      name: string;
      description: string;
    };
  };
}

const brandsData: BrandData[] = [
  {
    name: "Apple",
    logo: "https://example.com/logos/apple.png",
    translations: {
      en: {
        name: "Apple",
        description:
          "American multinational technology company specializing in consumer electronics, software, and online services.",
      },
      vi: {
        name: "Apple",
        description:
          "Công ty công nghệ đa quốc gia của Mỹ chuyên về điện tử tiêu dùng, phần mềm và dịch vụ trực tuyến.",
      },
    },
  },
  {
    name: "Samsung",
    logo: "https://example.com/logos/samsung.png",
    translations: {
      en: {
        name: "Samsung",
        description: "South Korean multinational conglomerate known for electronics, smartphones, and home appliances.",
      },
      vi: {
        name: "Samsung",
        description: "Tập đoàn đa quốc gia Hàn Quốc nổi tiếng về điện tử, điện thoại thông minh và thiết bị gia dụng.",
      },
    },
  },
  {
    name: "Sony",
    logo: "https://example.com/logos/sony.png",
    translations: {
      en: {
        name: "Sony",
        description:
          "Japanese multinational conglomerate specializing in electronics, gaming, entertainment, and financial services.",
      },
      vi: {
        name: "Sony",
        description: "Tập đoàn đa quốc gia Nhật Bản chuyên về điện tử, trò chơi, giải trí và dịch vụ tài chính.",
      },
    },
  },
  {
    name: "LG",
    logo: "https://example.com/logos/lg.png",
    translations: {
      en: {
        name: "LG",
        description:
          "South Korean electronics company producing consumer electronics, home appliances, and mobile devices.",
      },
      vi: {
        name: "LG",
        description: "Công ty điện tử Hàn Quốc sản xuất đồ điện tử tiêu dùng, thiết bị gia dụng và thiết bị di động.",
      },
    },
  },
  {
    name: "Dell",
    logo: "https://example.com/logos/dell.png",
    translations: {
      en: {
        name: "Dell",
        description: "American technology company developing, selling, and supporting computers and related products.",
      },
      vi: {
        name: "Dell",
        description: "Công ty công nghệ Mỹ phát triển, bán và hỗ trợ máy tính và các sản phẩm liên quan.",
      },
    },
  },
  {
    name: "HP",
    logo: "https://example.com/logos/hp.png",
    translations: {
      en: {
        name: "HP",
        description:
          "American multinational information technology company providing hardware, software, and related services.",
      },
      vi: {
        name: "HP",
        description:
          "Công ty công nghệ thông tin đa quốc gia của Mỹ cung cấp phần cứng, phần mềm và dịch vụ liên quan.",
      },
    },
  },
  {
    name: "Asus",
    logo: "https://example.com/logos/asus.png",
    translations: {
      en: {
        name: "Asus",
        description:
          "Taiwanese multinational computer hardware and electronics company known for laptops, desktops, and components.",
      },
      vi: {
        name: "Asus",
        description:
          "Công ty đa quốc gia Đài Loan chuyên về phần cứng máy tính và điện tử nổi tiếng với laptop, máy tính để bàn và linh kiện.",
      },
    },
  },
  {
    name: "Acer",
    logo: "https://example.com/logos/acer.png",
    translations: {
      en: {
        name: "Acer",
        description:
          "Taiwanese multinational hardware and electronics corporation specializing in advanced electronics technology.",
      },
      vi: {
        name: "Acer",
        description: "Tập đoàn phần cứng và điện tử đa quốc gia Đài Loan chuyên về công nghệ điện tử tiên tiến.",
      },
    },
  },
  {
    name: "Microsoft",
    logo: "https://example.com/logos/microsoft.png",
    translations: {
      en: {
        name: "Microsoft",
        description:
          "American multinational technology company producing software, electronics, and personal computers.",
      },
      vi: {
        name: "Microsoft",
        description: "Công ty công nghệ đa quốc gia của Mỹ sản xuất phần mềm, điện tử và máy tính cá nhân.",
      },
    },
  },
  {
    name: "Lenovo",
    logo: "https://example.com/logos/lenovo.png",
    translations: {
      en: {
        name: "Lenovo",
        description:
          "Chinese multinational technology company specializing in designing, manufacturing, and selling computers and electronics.",
      },
      vi: {
        name: "Lenovo",
        description: "Công ty công nghệ đa quốc gia Trung Quốc chuyên thiết kế, sản xuất và bán máy tính và điện tử.",
      },
    },
  },
  {
    name: "Google",
    logo: "https://example.com/logos/google.png",
    translations: {
      en: {
        name: "Google",
        description:
          "American multinational technology company specializing in Internet-related services and products.",
      },
      vi: {
        name: "Google",
        description: "Công ty công nghệ đa quốc gia của Mỹ chuyên về các dịch vụ và sản phẩm liên quan đến Internet.",
      },
    },
  },
];

export default async function main() {
  console.log("Starting brand and translation seeding...\n");

  // Ensure languages exist
  const languages = await ensureLanguagesExist();
  console.log("✅ Languages verified:", languages.map((l) => l.id).join(", "));

  // Get or create a system user for createdById
  const systemUser = await ensureSystemUser();
  console.log("✅ System user verified: ID", systemUser.id, "\n");

  let createdBrands = 0;
  let createdTranslations = 0;

  for (const brandData of brandsData) {
    try {
      // Check if brand already exists
      const existingBrand = await prisma.brand.findFirst({
        where: {
          name: brandData.name,
          deletedAt: null,
        },
      });

      let brand: Awaited<ReturnType<typeof prisma.brand.findFirst>>;
      if (existingBrand) {
        console.log(`⏭️ Brand "${brandData.name}" already exists (ID: ${existingBrand.id})`);
        brand = existingBrand;
      } else {
        // Create brand
        brand = await prisma.brand.create({
          data: {
            name: brandData.name,
            logo: brandData.logo,
            createdById: systemUser.id,
          },
        });
        createdBrands++;
        console.log(`✅ Created brand: ${brand.name} (ID: ${brand.id})`);
      }

      // Create translations for both languages
      for (const [langCode, translation] of Object.entries(brandData.translations)) {
        const language = languages.find((l) => l.id === langCode);
        if (!language) {
          console.log(`  ❌ Language ${langCode} not found, skipping translation`);
          continue;
        }

        // Check if translation already exists
        const existingTranslation = await prisma.brandTranslation.findFirst({
          where: {
            brandId: brand.id,
            languageId: langCode,
            deletedAt: null,
          },
        });

        if (existingTranslation) {
          console.log(`  ⏭️ Translation [${langCode}] already exists for "${brandData.name}"`);
          continue;
        }

        // Create translation
        await prisma.brandTranslation.create({
          data: {
            brandId: brand.id,
            languageId: langCode,
            name: translation.name,
            description: translation.description,
            createdById: systemUser.id,
          },
        });
        createdTranslations++;
        console.log(`  ✅ Created translation [${langCode}]: ${translation.name}`);
      }

      console.log("");
    } catch (error) {
      console.error(`❌ Error processing brand "${brandData.name}":`, error);
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Brands created: ${createdBrands}`);
  console.log(`Translations created: ${createdTranslations}`);
  console.log("Seeding completed successfully!");
}

async function ensureLanguagesExist() {
  const languagesToEnsure = [
    { id: "en", name: "English" },
    { id: "vi", name: "Vietnamese" },
  ];

  const languages: NonNullable<Awaited<ReturnType<typeof prisma.language.findFirst>>>[] = [];

  for (const lang of languagesToEnsure) {
    let language = await prisma.language.findFirst({
      where: { id: lang.id, deletedAt: null },
    });

    if (!language) {
      language = await prisma.language.create({
        data: {
          id: lang.id,
          name: lang.name,
        },
      });
      console.log(`Created language: ${lang.name} (${lang.id})`);
    }

    languages.push(language);
  }

  return languages;
}

async function ensureSystemUser() {
  // Try to find an existing admin user
  let user = await prisma.user.findFirst({
    where: {
      deletedAt: null,
    },
    orderBy: {
      id: "asc",
    },
  });

  // If no user exists, create a system user
  if (!user) {
    // First ensure a role exists
    let role = await prisma.role.findFirst({
      where: { deletedAt: null },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: "System",
          description: "System role for automated tasks",
          isActive: true,
        },
      });
    }

    user = await prisma.user.create({
      data: {
        email: "system@example.com",
        name: "System User",
        password: "not-used",
        phoneNumber: "0000000000",
        roleId: role.id,
        status: "ACTIVE",
      },
    });
    console.log("Created system user for seeding");
  }

  return user;
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error("Error during seeding:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
