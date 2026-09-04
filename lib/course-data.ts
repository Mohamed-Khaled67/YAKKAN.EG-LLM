// lib/course-data.ts

export type EducationType = "UNIVERSITY" | "SECONDARY"

export type AcademicLevel =
  | "UNIVERSITY_LEVEL_1"
  | "UNIVERSITY_LEVEL_2"
  | "UNIVERSITY_LEVEL_3"
  | "UNIVERSITY_LEVEL_4"
  | "SECONDARY_GRADE_1"
  | "SECONDARY_GRADE_2"
  | "SECONDARY_GRADE_3"

export type Semester = "FIRST" | "SECOND"

export type SecondaryTrack =
  | "SCIENCE"
  | "LITERARY"
  | "SCIENCE_SCIENCES"
  | "SCIENCE_MATH"

export interface Subject {
  id: string
  name: string
}

export const universityData = {
  UNIVERSITY_LEVEL_1: {
    label: "المستوى الأول",

    FIRST: [
      {
        id: "financial-accounting",
        name: "مبادئ المحاسبة المالية",
      },
      {
        id: "law-principles",
        name: "مبادئ القانون",
      },
      {
        id: "english",
        name: "لغة أنجليزية",
      },
      {
        id: "economics-principles",
        name: "مبادئ الأقتصاد",
      },
      {
        id: "business-management",
        name: "مبادئ أدارة الأعمال",
      },
    ],

    SECOND: [
      {
        id: "entrepreneurship",
        name: "ريادة الأعمال",
      },
      {
        id: "communication-skills",
        name: "طرق مهارات الأتصال",
      },
      {
        id: "innovative-thinking",
        name: "التفكير الأبتكاري",
      },
      {
        id: "accounting-2",
        name: "مبادئ المحاسبة 2",
      },
      {
        id: "organizational-behavior",
        name: "السلوك التنظيمي",
      },
      {
        id: "human-rights",
        name: "حقوق الإنسان",
      },
    ],
  },

  UNIVERSITY_LEVEL_2: {
    label: "المستوى الثاني",

    FIRST: [
      {
        id: "cost-accounting",
        name: "مبادئ محاسبة التكاليف",
      },
      {
        id: "commercial-law",
        name: "القانون التجاري",
      },
      {
        id: "logistics-supply-chain",
        name: "اللوجستيات وسلاسل الأمداد",
      },
      {
        id: "macroeconomics",
        name: "الأقتصاد الكلي",
      },
      {
        id: "marketing-principles",
        name: "مبادئ التسويق",
      },
    ],

    SECOND: [
      {
        id: "financial-management",
        name: "مبادئ الأدارة المالية",
      },
      {
        id: "management-english-2",
        name: "لغة (2) إدارة",
      },
      {
        id: "management-accounting",
        name: "مبادئ المحاسبة الإدارية",
      },
      {
        id: "production-management",
        name: "إدارة الأنتاج",
      },
      {
        id: "business-analytics",
        name: "تحليلات الأعمال",
      },
      {
        id: "management-information-systems",
        name: "نظم المعلومات الإدارية",
      },
    ],
  },

  UNIVERSITY_LEVEL_3: {
    label: "المستوى الثالث",

    FIRST: [
      {
        id: "investment-basics",
        name: "أساسيات الأستثمار",
      },
      {
        id: "cooperative-finance",
        name: "التمويل التعاوني",
      },
      {
        id: "business-ethics-governance",
        name: "أخلاقيات الأعمال والحوكمة",
      },
      {
        id: "human-resources",
        name: "إدارة الموارد البشرية",
      },
      {
        id: "public-finance-tax",
        name: "المالية العامة والضرائب",
      },
    ],

    SECOND: [
      {
        id: "government-accounting",
        name: "المحاسبة الحكومية",
      },
      {
        id: "entrepreneurship-3",
        name: "ريادة الأعمال",
      },
      {
        id: "cooperative-organization",
        name: "تنظيم تعاوني",
      },
      {
        id: "strategic-management",
        name: "الإدارة الأستراتيجية",
      },
      {
        id: "total-quality-management",
        name: "إدارة الجودة الشاملة",
      },
      {
        id: "money-banking-economics",
        name: "أقتصاديات النقود والبنوك",
      },
    ],
  },

  UNIVERSITY_LEVEL_4: {
    label: "المستوى الرابع",

    FIRST: [
      {
        id: "accounting-information-systems",
        name: "نظم المعلومات المحاسبية",
      },
      {
        id: "performance-incentives",
        name: "إدارة الأداء والحوافز",
      },
      {
        id: "accounting-problems",
        name: "المشكلات المحاسبية",
      },
      {
        id: "economic-feasibility",
        name: "دراسات الجدوى الأقتصادية",
      },
      {
        id: "quantitative-methods",
        name: "الأساليب الكمية وأتخاذ القرارت",
      },
    ],

    SECOND: [
      {
        id: "cooperative-accounting-problems",
        name: "المشكلات المحاسبية للتعاونيات",
      },
      {
        id: "change-management",
        name: "إدارة التغيير",
      },
      {
        id: "e-business",
        name: "إدارة الأعمال الألكترونية",
      },
      {
        id: "auditing-control",
        name: "المراجعة وأنظمة الضبط",
      },
      {
        id: "tax-accounting",
        name: "المحاسبة الضريبية",
      },
      {
        id: "applied-statistics",
        name: "الأحصاء التطبيقي",
      },
    ],
  },
} as const

// ==========================================
// الثانوية العامة
// ==========================================

export const secondaryData = {
  SECONDARY_GRADE_1: {
    label: "الصف الأول الثانوي",

    // لا يوجد شعبة في الصف الأول
    tracks: null,

    FIRST: [
      {
        id: "arabic",
        name: "اللغة العربية",
      },
      {
        id: "first-foreign-language",
        name: "اللغة الأجنبية الأولى",
      },
      {
        id: "history",
        name: "التاريخ",
      },
      {
        id: "mathematics",
        name: "الرياضيات",
      },
      {
        id: "integrated-science",
        name: "العلوم المتكاملة",
      },
      {
        id: "philosophy-logic",
        name: "الفلسفة والمنطق",
      },
      {
        id: "religious-education",
        name: "التربية الدينية",
      },
      {
        id: "second-foreign-language",
        name: "اللغة الأجنبية الثانية",
      },
      {
        id: "physical-education",
        name: "التربية الرياضية",
      },
      {
        id: "programming-ai",
        name: "البرمجة والذكاء الاصطناعي",
      },
    ],

    SECOND: [
      {
        id: "arabic",
        name: "اللغة العربية",
      },
      {
        id: "first-foreign-language",
        name: "اللغة الأجنبية الأولى",
      },
      {
        id: "history",
        name: "التاريخ",
      },
      {
        id: "mathematics",
        name: "الرياضيات",
      },
      {
        id: "integrated-science",
        name: "العلوم المتكاملة",
      },
      {
        id: "philosophy-logic",
        name: "الفلسفة والمنطق",
      },
      {
        id: "religious-education",
        name: "التربية الدينية",
      },
      {
        id: "second-foreign-language",
        name: "اللغة الأجنبية الثانية",
      },
      {
        id: "physical-education",
        name: "التربية الرياضية",
      },
      {
        id: "programming-ai",
        name: "البرمجة والذكاء الاصطناعي",
      },
    ],
  },

  SECONDARY_GRADE_2: {
    label: "الصف الثاني الثانوي",

    tracks: {
      SCIENCE: {
        label: "الشعبة العلمية",

        FIRST: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "mathematics",
            name: "الرياضيات",
          },
          {
            id: "history",
            name: "التاريخ",
          },
          {
            id: "chemistry",
            name: "الكيمياء",
          },
          {
            id: "physics",
            name: "الفيزياء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],

        SECOND: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "mathematics",
            name: "الرياضيات",
          },
          {
            id: "history",
            name: "التاريخ",
          },
          {
            id: "chemistry",
            name: "الكيمياء",
          },
          {
            id: "physics",
            name: "الفيزياء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],
      },

      LITERARY: {
        label: "الشعبة الأدبية",

        FIRST: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "history",
            name: "التاريخ",
          },
          {
            id: "geography",
            name: "الجغرافيا",
          },
          {
            id: "psychology",
            name: "علم النفس",
          },
          {
            id: "mathematics",
            name: "الرياضيات",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],

        SECOND: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "history",
            name: "التاريخ",
          },
          {
            id: "geography",
            name: "الجغرافيا",
          },
          {
            id: "psychology",
            name: "علم النفس",
          },
          {
            id: "mathematics",
            name: "الرياضيات",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],
      },
    },
  },

  SECONDARY_GRADE_3: {
    label: "الصف الثالث الثانوي",

    tracks: {
      SCIENCE_SCIENCES: {
        label: "علمي علوم",

        FIRST: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "biology",
            name: "الأحياء",
          },
          {
            id: "chemistry",
            name: "الكيمياء",
          },
          {
            id: "physics",
            name: "الفيزياء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],

        SECOND: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "biology",
            name: "الأحياء",
          },
          {
            id: "chemistry",
            name: "الكيمياء",
          },
          {
            id: "physics",
            name: "الفيزياء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],
      },

      SCIENCE_MATH: {
        label: "علمي رياضة",

        FIRST: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "mathematics",
            name: "الرياضيات",
          },
          {
            id: "chemistry",
            name: "الكيمياء",
          },
          {
            id: "physics",
            name: "الفيزياء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],

        SECOND: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "mathematics",
            name: "الرياضيات",
          },
          {
            id: "chemistry",
            name: "الكيمياء",
          },
          {
            id: "physics",
            name: "الفيزياء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],
      },

      LITERARY: {
        label: "الشعبة الأدبية",

        FIRST: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "history",
            name: "التاريخ",
          },
          {
            id: "geography",
            name: "الجغرافيا",
          },
          {
            id: "statistics",
            name: "الإحصاء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],

        SECOND: [
          {
            id: "arabic",
            name: "اللغة العربية",
          },
          {
            id: "first-foreign-language",
            name: "اللغة الأجنبية الأولى",
          },
          {
            id: "history",
            name: "التاريخ",
          },
          {
            id: "geography",
            name: "الجغرافيا",
          },
          {
            id: "statistics",
            name: "الإحصاء",
          },
          {
            id: "religious-education",
            name: "التربية الدينية",
          },
          {
            id: "second-foreign-language",
            name: "اللغة الأجنبية الثانية",
          },
          {
            id: "physical-education",
            name: "التربية الرياضية",
          },
          {
            id: "national-education",
            name: "التربية الوطنية",
          },
        ],
      },
    },
  },
} as const