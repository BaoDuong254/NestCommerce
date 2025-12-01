import { PrismaService } from "src/shared/services/prisma.service";

const prisma = new PrismaService();

interface CategoryData {
  name: string;
  logo: string | null;
  parentCategoryId?: number | null;
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
  children?: CategoryData[];
}

const categoriesData: CategoryData[] = [
  {
    name: "Electronics",
    logo: "https://example.com/icons/electronics.png",
    translations: {
      en: {
        name: "Electronics",
        description: "Electronic devices and accessories including smartphones, laptops, tablets, and more.",
      },
      vi: {
        name: "Điện tử",
        description:
          "Các thiết bị điện tử và phụ kiện bao gồm điện thoại thông minh, laptop, máy tính bảng và nhiều hơn nữa.",
      },
    },
    children: [
      {
        name: "Smartphones",
        logo: "https://example.com/icons/smartphones.png",
        translations: {
          en: {
            name: "Smartphones",
            description: "Latest smartphones from top brands with advanced features and technology.",
          },
          vi: {
            name: "Điện thoại thông minh",
            description:
              "Điện thoại thông minh mới nhất từ các thương hiệu hàng đầu với tính năng và công nghệ tiên tiến.",
          },
        },
      },
      {
        name: "Laptops",
        logo: "https://example.com/icons/laptops.png",
        translations: {
          en: {
            name: "Laptops",
            description: "High-performance laptops for work, gaming, and everyday use.",
          },
          vi: {
            name: "Laptop",
            description: "Laptop hiệu năng cao cho công việc, chơi game và sử dụng hàng ngày.",
          },
        },
      },
      {
        name: "Tablets",
        logo: "https://example.com/icons/tablets.png",
        translations: {
          en: {
            name: "Tablets",
            description: "Portable tablets for entertainment, productivity, and creativity.",
          },
          vi: {
            name: "Máy tính bảng",
            description: "Máy tính bảng di động cho giải trí, năng suất và sáng tạo.",
          },
        },
      },
      {
        name: "Headphones & Audio",
        logo: "https://example.com/icons/audio.png",
        translations: {
          en: {
            name: "Headphones & Audio",
            description: "Premium headphones, earbuds, and audio equipment for music lovers.",
          },
          vi: {
            name: "Tai nghe & Âm thanh",
            description: "Tai nghe cao cấp, tai nghe nhét tai và thiết bị âm thanh cho người yêu âm nhạc.",
          },
        },
      },
    ],
  },
  {
    name: "Fashion",
    logo: "https://example.com/icons/fashion.png",
    translations: {
      en: {
        name: "Fashion",
        description: "Trendy clothing, shoes, and accessories for men, women, and children.",
      },
      vi: {
        name: "Thời trang",
        description: "Quần áo, giày dép và phụ kiện thời trang cho nam, nữ và trẻ em.",
      },
    },
    children: [
      {
        name: "Men's Fashion",
        logo: "https://example.com/icons/mens-fashion.png",
        translations: {
          en: {
            name: "Men's Fashion",
            description: "Stylish clothing and accessories for modern men.",
          },
          vi: {
            name: "Thời trang Nam",
            description: "Quần áo và phụ kiện phong cách cho nam giới hiện đại.",
          },
        },
      },
      {
        name: "Women's Fashion",
        logo: "https://example.com/icons/womens-fashion.png",
        translations: {
          en: {
            name: "Women's Fashion",
            description: "Elegant clothing and accessories for women of all styles.",
          },
          vi: {
            name: "Thời trang Nữ",
            description: "Quần áo và phụ kiện thanh lịch cho phụ nữ với mọi phong cách.",
          },
        },
      },
      {
        name: "Kids' Fashion",
        logo: "https://example.com/icons/kids-fashion.png",
        translations: {
          en: {
            name: "Kids' Fashion",
            description: "Comfortable and fun clothing for children of all ages.",
          },
          vi: {
            name: "Thời trang Trẻ em",
            description: "Quần áo thoải mái và vui nhộn cho trẻ em ở mọi lứa tuổi.",
          },
        },
      },
      {
        name: "Shoes & Footwear",
        logo: "https://example.com/icons/shoes.png",
        translations: {
          en: {
            name: "Shoes & Footwear",
            description: "Quality shoes for every occasion and activity.",
          },
          vi: {
            name: "Giày dép",
            description: "Giày dép chất lượng cho mọi dịp và hoạt động.",
          },
        },
      },
    ],
  },
  {
    name: "Home & Living",
    logo: "https://example.com/icons/home.png",
    translations: {
      en: {
        name: "Home & Living",
        description: "Furniture, home decor, and essentials to make your house a home.",
      },
      vi: {
        name: "Nhà cửa & Đời sống",
        description: "Nội thất, đồ trang trí và các vật dụng thiết yếu để biến ngôi nhà thành tổ ấm.",
      },
    },
    children: [
      {
        name: "Furniture",
        logo: "https://example.com/icons/furniture.png",
        translations: {
          en: {
            name: "Furniture",
            description: "Modern and classic furniture for every room in your home.",
          },
          vi: {
            name: "Nội thất",
            description: "Nội thất hiện đại và cổ điển cho mọi phòng trong nhà bạn.",
          },
        },
      },
      {
        name: "Home Decor",
        logo: "https://example.com/icons/decor.png",
        translations: {
          en: {
            name: "Home Decor",
            description: "Decorative items to personalize and beautify your living space.",
          },
          vi: {
            name: "Đồ trang trí",
            description: "Các vật dụng trang trí để cá nhân hóa và làm đẹp không gian sống của bạn.",
          },
        },
      },
      {
        name: "Kitchen & Dining",
        logo: "https://example.com/icons/kitchen.png",
        translations: {
          en: {
            name: "Kitchen & Dining",
            description: "Essential cookware, utensils, and dining accessories.",
          },
          vi: {
            name: "Nhà bếp & Phòng ăn",
            description: "Dụng cụ nấu ăn, dao nĩa và phụ kiện phòng ăn thiết yếu.",
          },
        },
      },
    ],
  },
  {
    name: "Sports & Outdoors",
    logo: "https://example.com/icons/sports.png",
    translations: {
      en: {
        name: "Sports & Outdoors",
        description: "Sports equipment, fitness gear, and outdoor adventure essentials.",
      },
      vi: {
        name: "Thể thao & Ngoài trời",
        description: "Thiết bị thể thao, dụng cụ tập luyện và đồ dùng thiết yếu cho hoạt động ngoài trời.",
      },
    },
    children: [
      {
        name: "Fitness Equipment",
        logo: "https://example.com/icons/fitness.png",
        translations: {
          en: {
            name: "Fitness Equipment",
            description: "Home gym equipment and accessories for your fitness journey.",
          },
          vi: {
            name: "Thiết bị tập luyện",
            description: "Thiết bị phòng gym tại nhà và phụ kiện cho hành trình thể hình của bạn.",
          },
        },
      },
      {
        name: "Outdoor Recreation",
        logo: "https://example.com/icons/outdoor.png",
        translations: {
          en: {
            name: "Outdoor Recreation",
            description: "Camping, hiking, and outdoor adventure gear.",
          },
          vi: {
            name: "Giải trí ngoài trời",
            description: "Thiết bị cắm trại, leo núi và phiêu lưu ngoài trời.",
          },
        },
      },
      {
        name: "Sports Wear",
        logo: "https://example.com/icons/sportswear.png",
        translations: {
          en: {
            name: "Sports Wear",
            description: "Comfortable athletic clothing for all types of sports and activities.",
          },
          vi: {
            name: "Trang phục thể thao",
            description: "Quần áo thể thao thoải mái cho mọi loại hình thể thao và hoạt động.",
          },
        },
      },
    ],
  },
  {
    name: "Beauty & Health",
    logo: "https://example.com/icons/beauty.png",
    translations: {
      en: {
        name: "Beauty & Health",
        description: "Skincare, cosmetics, and health products for your wellbeing.",
      },
      vi: {
        name: "Sắc đẹp & Sức khỏe",
        description: "Sản phẩm chăm sóc da, mỹ phẩm và sản phẩm sức khỏe cho sự khỏe mạnh của bạn.",
      },
    },
    children: [
      {
        name: "Skincare",
        logo: "https://example.com/icons/skincare.png",
        translations: {
          en: {
            name: "Skincare",
            description: "Premium skincare products for healthy and glowing skin.",
          },
          vi: {
            name: "Chăm sóc da",
            description: "Sản phẩm chăm sóc da cao cấp cho làn da khỏe mạnh và rạng rỡ.",
          },
        },
      },
      {
        name: "Cosmetics",
        logo: "https://example.com/icons/cosmetics.png",
        translations: {
          en: {
            name: "Cosmetics",
            description: "Quality makeup and beauty products for every look.",
          },
          vi: {
            name: "Mỹ phẩm",
            description: "Sản phẩm trang điểm và làm đẹp chất lượng cho mọi phong cách.",
          },
        },
      },
      {
        name: "Health Supplements",
        logo: "https://example.com/icons/supplements.png",
        translations: {
          en: {
            name: "Health Supplements",
            description: "Vitamins, minerals, and nutritional supplements for optimal health.",
          },
          vi: {
            name: "Thực phẩm chức năng",
            description: "Vitamin, khoáng chất và thực phẩm bổ sung dinh dưỡng cho sức khỏe tối ưu.",
          },
        },
      },
    ],
  },
  {
    name: "Books & Media",
    logo: "https://example.com/icons/books.png",
    translations: {
      en: {
        name: "Books & Media",
        description: "Books, movies, music, and entertainment media for all interests.",
      },
      vi: {
        name: "Sách & Truyền thông",
        description: "Sách, phim, nhạc và các phương tiện giải trí cho mọi sở thích.",
      },
    },
    children: [
      {
        name: "Books",
        logo: "https://example.com/icons/books-cat.png",
        translations: {
          en: {
            name: "Books",
            description: "Fiction, non-fiction, educational books across all genres.",
          },
          vi: {
            name: "Sách",
            description: "Sách hư cấu, phi hư cấu, sách giáo dục thuộc mọi thể loại.",
          },
        },
      },
      {
        name: "Movies & TV",
        logo: "https://example.com/icons/movies.png",
        translations: {
          en: {
            name: "Movies & TV",
            description: "DVDs, Blu-rays, and digital media of your favorite shows and movies.",
          },
          vi: {
            name: "Phim & TV",
            description: "DVD, Blu-ray và phương tiện kỹ thuật số của các chương trình và phim yêu thích.",
          },
        },
      },
      {
        name: "Music",
        logo: "https://example.com/icons/music.png",
        translations: {
          en: {
            name: "Music",
            description: "CDs, vinyl records, and digital music across all genres.",
          },
          vi: {
            name: "Âm nhạc",
            description: "CD, đĩa than và nhạc số thuộc mọi thể loại.",
          },
        },
      },
    ],
  },
];

export default async function main() {
  console.log("Starting category and translation seeding...\n");

  // Ensure languages exist
  const languages = await ensureLanguagesExist();
  console.log("✅ Languages verified:", languages.map((l) => l.id).join(", "));

  // Get or create a system user for createdById
  const systemUser = await ensureSystemUser();
  console.log("✅ System user verified: ID", systemUser.id, "\n");

  let createdCategories = 0;
  let createdTranslations = 0;

  // Process categories with parent-child relationships
  for (const categoryData of categoriesData) {
    await processCategory(categoryData, null, systemUser.id, languages);
  }

  async function processCategory(
    categoryData: CategoryData,
    parentId: number | null,
    systemUserId: number,
    languages: NonNullable<Awaited<ReturnType<typeof prisma.language.findFirst>>>[]
  ) {
    try {
      // Check if category already exists
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: categoryData.name,
          parentCategoryId: parentId,
          deletedAt: null,
        },
      });

      let category: Awaited<ReturnType<typeof prisma.category.findFirst>>;
      if (existingCategory) {
        console.log(`⏭️ Category "${categoryData.name}" already exists (ID: ${existingCategory.id})`);
        category = existingCategory;
      } else {
        // Create category
        category = await prisma.category.create({
          data: {
            name: categoryData.name,
            logo: categoryData.logo,
            parentCategoryId: parentId,
            createdById: systemUserId,
          },
        });
        createdCategories++;
        console.log(`✅ Created category: ${category.name} (ID: ${category.id})`);
      }

      // Create translations for both languages
      for (const [langCode, translation] of Object.entries(categoryData.translations)) {
        const language = languages.find((l) => l.id === langCode);
        if (!language) {
          console.log(`  ❌ Language ${langCode} not found, skipping translation`);
          continue;
        }

        // Check if translation already exists
        const existingTranslation = await prisma.categoryTranslation.findFirst({
          where: {
            categoryId: category.id,
            languageId: langCode,
            deletedAt: null,
          },
        });

        if (existingTranslation) {
          console.log(`  ⏭️ Translation [${langCode}] already exists for "${categoryData.name}"`);
          continue;
        }

        // Create translation
        await prisma.categoryTranslation.create({
          data: {
            categoryId: category.id,
            languageId: langCode,
            name: translation.name,
            description: translation.description,
            createdById: systemUserId,
          },
        });
        createdTranslations++;
        console.log(`  ✅ Created translation [${langCode}]: ${translation.name}`);
      }

      // Process children categories
      if (categoryData.children && categoryData.children.length > 0) {
        console.log(`  🔄 Processing ${categoryData.children.length} child categories...`);
        for (const childData of categoryData.children) {
          await processCategory(childData, category.id, systemUserId, languages);
        }
      }

      console.log("");
    } catch (error) {
      console.error(`❌ Error processing category "${categoryData.name}":`, error);
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Categories created: ${createdCategories}`);
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
