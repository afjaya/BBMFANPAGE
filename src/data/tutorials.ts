// src/data/tutorials.ts

import { Tutorial, Attachment, FaqItem } from "../types";

export const TUTORIALS: any[] = [
  // OPENTOONZ BASIC
  {
    id: "basic-01",
    category: "basic",
    duration: "14:25",
    publishDate: {
      id: "12 Juni 2026",
      en: "June 12, 2026"
    },
    title: {
      id: "Pengenalan Interface & Level di OpenToonz",
      en: "Introduction to Interface & Levels in OpenToonz"
    },
    description: {
      id: "Panduan lengkap instalasi serta memahami struktur workspace OpenToonz. Kita akan membahas perbedaan mendasar antara Vector Level, Toonz Raster Level, dan Standard Raster Level agar tidak salah pilih saat mulai menggambar.",
      en: "Complete guide to installation and understanding the OpenToonz workspace structure. We will discuss the fundamental differences between Vector Level, Toonz Raster Level, and Standard Raster Level so you don't choose the wrong one when drawing."
    },
    youtubeId: "Wv7f38n9sK0",
    difficulty: {
      id: "Pemula",
      en: "Beginner"
    },
    bullets: {
      id: [
        "Cara install FFmpeg agar bisa import & export format MP4/GIF",
        "Perbedaan mendasar Vector Level (Merah) vs Toonz Raster (Biru)",
        "Mengonfigurasi shortcut keyboard untuk mempercepat drawing workflow"
      ],
      en: [
        "How to install FFmpeg for importing & exporting MP4/GIF formats",
        "Fundamental differences between Vector Level (Red) vs Toonz Raster (Blue)",
        "Configuring keyboard shortcuts to speed up your drawing workflow"
      ]
    }
  },
  {
    id: "basic-02",
    category: "basic",
    duration: "18:10",
    publishDate: {
      id: "2 Juni 2026",
      en: "June 2, 2026"
    },
    title: {
      id: "Menguasai Drawing Tools & Palette Editor",
      en: "Mastering Drawing Tools & Palette Editor"
    },
    description: {
      id: "Pelajari cara menggambar garis yang lurus, lengkung, serta mewarnai area gambar secara instan menggunakan Palette Editor berfitur auto-match paint. Tidak perlu repot mewarnai ulang garis satu per satu!",
      en: "Learn how to draw straight or curved lines, and color your drawings instantly using the Palette Editor featuring auto-match paint. No need to worry about recoloring lines one by one!"
    },
    youtubeId: "vB0W-K_BwQc",
    difficulty: {
      id: "Pemula",
      en: "Beginner"
    },
    bullets: {
      id: [
        "Menggunakan Brush Tool dengan stabilizer menyala (Smoothness)",
        "Membuat palette warna pintar yang bisa diubah warnanya secara global",
        "Teknik mewarnai area tertutup dengan Fill Tool (Bucket)"
      ],
      en: [
        "Using the Brush Tool with the stabilizer enabled (Smoothness)",
        "Creating smart color palettes that can be globally modified later",
        "Techniques for coloring closed areas using the Fill Tool (Bucket)"
      ]
    }
  },

  // RIGGING
  {
    id: "rig-01",
    category: "rigging",
    duration: "25:40",
    publishDate: {
      id: "28 Mei 2026",
      en: "May 28, 2026"
    },
    title: {
      id: "Rigging Karakter Sederhana dengan Plastic Tool",
      en: "Simple Character Rigging with the Plastic Tool"
    },
    description: {
      id: "Tutorial langkah demi langkah melakukan rigging karakter 2D tanpa harus menggambar ulang setiap frame. Menggunakan mesh generation dan pembangunan struktur tulang sendi (skeletal structure) yang fleksibel.",
      en: "Step-by-step tutorial on rigging a 2D character without redrawing every single frame. Learn smart mesh generation and how to build a flexible skeletal bone structure."
    },
    youtubeId: "6K2IidO86vI",
    difficulty: {
      id: "Menengah",
      en: "Intermediate"
    },
    bullets: {
      id: [
        "Cara mengonversi gambar biasa (Raster/Vector) menjadi Mesh jaring pintar",
        "Membangun sambungan sendi tulang dari tubuh, paha, lutut, hingga pergelangan kaki",
        "Mencegah distorsi gambar berlebih pada area lipatan sendi dengan menjaga berat vertex"
      ],
      en: [
        "How to convert standard drawings (Raster/Vector) into a smart mesh grid",
        "Building bone joint connections from the torso, thighs, knees down to ankles",
        "Preventing excessive image distortion in joint folds by managing vertex weights"
      ]
    }
  },
  {
    id: "rig-02",
    category: "rigging",
    duration: "20:15",
    publishDate: {
      id: "15 Mei 2026",
      en: "May 15, 2026"
    },
    title: {
      id: "Rigging Wajah & Ekspresi Menggunakan Pegbars",
      en: "Facial Rigging & Expressions Using Pegbars"
    },
    description: {
      id: "Belajar mengatur hierarki objek di OpenToonz. Hubungkan mata, alis, dan mulut ke bone utama wajah agar ketika kepala berputar, seluruh elemen wajah mengikuti secara presisi.",
      en: "Learn object hierarchy configuration in OpenToonz. Link eyes, eyebrows, and mouth to the primary face bone so that all elements follow precisely when the head rotates."
    },
    youtubeId: "U4iO2d1eKms",
    difficulty: {
      id: "Menengah",
      en: "Intermediate"
    },
    bullets: {
      id: [
        "Memahami Schematic View untuk menghubungkan node hierarki",
        "Mengatur titik pusat rotasi (Center Point) pada mata dan mulut",
        "Tips transisi penggantian mulut (Switching Level) saat berbicara (Lip Sync)"
      ],
      en: [
        "Understanding the Schematic View to wire up hierarchical nodes",
        "Adjusting rotation pivot points (Center Points) on eyes and mouth",
        "Tips on mouth transition level swapping (Switching Level) for Lip Sync"
      ]
    }
  },

  // ANIMATING
  {
    id: "anim-01",
    category: "animating",
    duration: "15:30",
    publishDate: {
      id: "8 Mei 2026",
      en: "May 8, 2026"
    },
    title: {
      id: "Prinsip Squash & Stretch pada Animasi Bouncing Ball",
      en: "Squash & Stretch Principles on a Bouncing Ball Animation"
    },
    description: {
      id: "Memahami 12 Prinsip Animasi dasar langsung di OpenToonz. Kita akan membuat animasi bola memantul dengan kurva interpolasi yang dinamis di Function Editor.",
      en: "Understand the core 12 Principles of Animation right inside OpenToonz. We will craft a bouncing ball with dynamic interpolation curves using the Function Editor."
    },
    youtubeId: "K6nGl87nreE",
    difficulty: {
      id: "Pemula",
      en: "Beginner"
    },
    bullets: {
      id: [
        "Membuat keyframe awal, tengah, dan akhir pada XSheet",
        "Mengatur kemiringan kurva grafik agar bola memiliki efek berat (gravity effect)",
        "Menggambar frame tambahan di antara keyframe (Inbetweening)"
      ],
      en: [
        "Creating starting, middle, and ending keyframes on the XSheet",
        "Adjusting graph curve handles to give the ball a realistic weight/gravity effect",
        "Drawing extra breakdown frames between keyframes (Inbetweening)"
      ]
    }
  },
  {
    id: "anim-02",
    category: "animating",
    duration: "32:12",
    publishDate: {
      id: "28 April 2026",
      en: "April 28, 2026"
    },
    title: {
      id: "Menganimasikan Karakter Berjalan (Walk-Cycle) Menyeluruh",
      en: "Animating a Full Character Walk-Cycle"
    },
    description: {
      id: "Panduan membuat animasi berjalan yang natural menggunakan rigging bone hasil tutorial sebelumnya. Mempelajari posisi 'Contact', 'Down', 'Passing', dan 'Up'.",
      en: "A comprehensive guide to building a natural walking animation using the skeletal rig from previous tutorials. Study the 'Contact', 'Down', 'Passing', and 'Up' poses."
    },
    youtubeId: "V_6Tka_0bRE",
    difficulty: {
      id: "Mahir",
      en: "Advanced"
    },
    bullets: {
      id: [
        "Mengatur pose tubuh utama di sumbu Y (naik turun saat melangkah)",
        "Menganimasikan pergerakan ayunan tangan yang berlawanan arah dengan kaki",
        "Menggunakan Onion Skin untuk memantau transisi langkah kaki"
      ],
      en: [
        "Adjusting the core body weight on the Y-axis (bouncing up/down while stepping)",
        "Animating arm swings that move in opposition to the leg directions",
        "Using the Onion Skin system to track fluid stride transitions"
      ]
    }
  },

  // FX (EFFECTS)
  {
    id: "fx-01",
    category: "fx",
    duration: "22:05",
    publishDate: {
      id: "10 April 2026",
      en: "April 10, 2026"
    },
    title: {
      id: "Membuat Efek Cahaya Sihir (Glow & Blur) dengan Schematic View",
      en: "Creating Magic Glow & Blur Effects with the Schematic View"
    },
    description: {
      id: "Masuk ke dunia VFX OpenToonz yang luar biasa. Kita akan belajar memisahkan level karakter, menambahkan efek pancaran cahaya berpendar, dan menyambungkan node kabel di editor skematik.",
      en: "Dive into the incredible world of OpenToonz VFX. We will learn how to isolate character levels, add radiant glowing flares, and connect nodes inside the schematic editor."
    },
    youtubeId: "CqOn9h6ZbeM",
    difficulty: {
      id: "Menengah",
      en: "Intermediate"
    },
    bullets: {
      id: [
        "Membuka panel FX Schematic dan memahami struktur port input/output",
        "Memasang efek 'Glow' dan mengatur radius glow beserta kepekatan warnanya",
        "Menggunakan efek 'Matte' agar cahaya hanya muncul di pinggiran luar gambar"
      ],
      en: [
        "Opening the FX Schematic panel and understanding input/output port wiring",
        "Applying the 'Glow' node and fine-tuning blur radius alongside color density",
        "Using 'Matte' effects to force glow fields exclusively onto image outer borders"
      ]
    }
  },

  // RENDERING
  {
    id: "render-01",
    category: "rendering",
    duration: "13:45",
    publishDate: {
      id: "2 April 2026",
      en: "April 2, 2026"
    },
    title: {
      id: "Konfigurasi FFmpeg & Rahasia Render Video HD Super Ringan",
      en: "FFmpeg Configuration & The Secret to Ultra-Light HD Video Rendering"
    },
    description: {
      id: "Sering mengalami error saat mengekspor animasi ke format MP4? Tutorial ini membahas konfigurasi lengkap instalasi encoder FFmpeg dan trik setting render terbaik untuk diunggah ke YouTube/Instagram.",
      en: "Frequently getting errors when exporting your animation to MP4 format? This tutorial breaks down the full installation of the FFmpeg encoder and the best export settings for YouTube/Instagram uploads."
    },
    youtubeId: "T7X2h1S8Q18",
    difficulty: {
      id: "Pemula",
      en: "Beginner"
    },
    bullets: {
      id: [
        "Langkah presisi mengunduh Static Build FFmpeg sesuai Windows/Mac",
        "Menyetel output settings dengan codec H.264 berkualitas tinggi",
        "Mengekspor background transparan menggunakan urutan file PNG sequence (.png)"
      ],
      en: [
        "Precise steps to download the FFmpeg Static Build for Windows/Mac setups",
        "Configuring output parameters using high-quality H.264 video compression",
        "Exporting transparent backgrounds utilizing PNG image sequence rendering (.png)"
      ]
    }
  }
];

export const ATTACHMENTS: any[] = [
  {
    name: "Karakter_Bobo_Rigged_Plastic.zip",
    fileSize: "4.8 MB",
    fileType: "OpenToonz Project Zip",
    downloadUrl: "#",
    category: "Rigging Resource",
    description: {
      id: "File project OpenToonz berisi karakter Bobo yang sudah di-rigging menggunakan Plastic Tool jaring 3D lengkap dengan sendi tulang lengan, badan, kaki, dan ekspresi mulut siap dianimasikan.",
      en: "OpenToonz project file containing the character Bobo rigged with 3D mesh Plastic Tools, complete with arms, torso, leg bones, and mouth expressions ready for animation."
    }
  },
  {
    name: "Template_Background_Kampung_Subuh.tnz",
    fileSize: "12.5 MB",
    fileType: "OpenToonz Scene File",
    downloadUrl: "#",
    category: "FX & Camera Template",
    description: {
      id: "Satu set scene background pedesaan bergaya anime subuh berkabut yang sudah dipisah per layer (Foreground, Midground, Background) untuk efek Paralaks kamera 3D.",
      en: "A village scene background package in a misty dawn anime style, pre-separated into layers (Foreground, Midground, Background) for 3D Camera Parallax setups."
    }
  },
  {
    name: "Mulut_LipSync_Switching_Level.png",
    fileSize: "1.2 MB",
    fileType: "PNG Layers Set",
    downloadUrl: "#",
    category: "2D Drawing Asset",
    description: {
      id: "Kumpulan template gambar bentuk mulut pengucapan A, I, U, E, O, M, F, L yang siap di-import sebagai sub-level menggantikan bentuk mulut karakter utama saat berbicara.",
      en: "Collection of mouth phoneme graphic templates (A, I, U, E, O, M, F, L) ready to import as a sub-level to replace main character mouth artwork during lip sync."
    }
  },
  {
    name: "Brush_Palet_Custom_BangBro.xml",
    fileSize: "320 KB",
    fileType: "Color Palette Import File",
    downloadUrl: "#",
    category: "Color Palette Preset",
    description: {
      id: "File palet warna retro pilihan terbaik tim Bang Bro Media untuk pewarnaan kulit, rambut bayangan, serta highlight neon style khas OpenToonz level.",
      en: "Retro color palette file handpicked by the Bang Bro Media team for optimal skin tones, shadow hair layers, and neon highlight styles unique to OpenToonz levels."
    }
  }
];

export const FAQ_ITEMS: any[] = [
  {
    id: "faq-01",
    category: "catInstall", // Menggunakan key mapping yang sinkron dengan FaqSection
    question: {
      id: "Mengapa opsi format ekspor MP4 tidak muncul di menu Output Settings?",
      en: "Why doesn't the MP4 export format option show up in the Output Settings menu?"
    },
    answer: {
      id: "Format MP4 memerlukan encoder eksternal bernama FFmpeg. Anda perlu mendownload FFmpeg static build, mengekstraknya di komputer, lalu mengarahkan letak folder tersebut melalui menu **File > Preferences > Import/Export > FFmpeg Path** di OpenToonz, kemudian restart program.",
      en: "The MP4 format requires an external encoder called FFmpeg. You need to download an FFmpeg static build, extract it to your machine, then route that folder location through **File > Preferences > Import/Export > FFmpeg Path** inside OpenToonz, and then restart the program."
    }
  },
  {
    id: "faq-02",
    category: "catLevel",
    question: {
      id: "Apa bedanya Toonz Vector Level, Toonz Raster Level, dan Raster Level biasa?",
      en: "What is the difference between Toonz Vector Level, Toonz Raster Level, and standard Raster Level?"
    },
    answer: {
      id: "Vector Level (ikon merah) menyimpan garis sebagai kurva matematika; Anda bisa mengubah ketebalan dan mewarnai area secara global sewaktu-waktu tanpa pecah. Toonz Raster (ikon biru) berbasis pixel namun memiliki palet warna pintar, sangat baik untuk tekstur kuas tradisional dengan tetap mempertahankan auto-fill. Raster Level standar tidak terikat palet pintar dan bekerja seperti canvas Photoshop biasa.",
      en: "Vector Level (red icon) stores strokes as mathematical paths; you can safely modify line weights and globally paint closed fields at any time without pixelation. Toonz Raster (blue icon) is pixel-based but comes with smart color swatches, great for traditional painterly textures while preserving vector-like auto-fill. Standard Raster Levels have no smart palette lock and behave just like a standard Photoshop canvas."
    }
  },
  {
    id: "faq-03",
    category: "catRigging",
    question: {
      id: "Kenapa saat menggunakan Plastic Tool gambar saya menjadi patah-patah atau bolong?",
      en: "Why does my drawing warp awkwardly or break apart when using the Plastic Tool?"
    },
    answer: {
      id: "Ini biasanya karena densitas Mesh (jaring) terlalu rendah atau sendi tulang Anda terlalu dekat dengan batas luar gambar. Pastikan sebelum menggambar tulang, Anda meng-klik 'Create Mesh' dan menaikkan parameter 'Edge' atau ketebalan margin mesh agar gambar terbungkus jaring proteksi penahan distorsi dengan aman.",
      en: "This usually occurs because your structural Mesh density is too low or your bone joints reside too close to the boundary limits of your drawing file. Before drawing bones, click 'Create Mesh' and pump up the 'Edge' width or mesh margin parameters so your asset stays securely wrapped inside a distortion-resistant deformation grid."
    }
  },
  {
    id: "faq-04",
    category: "catRender",
    question: {
      id: "Bagaimana cara membuat latar belakang (background) transparan saat dirender?",
      en: "How do I ensure my render outputs a completely transparent background?"
    },
    answer: {
      id: "Di OpenToonz, warna background bawaan di viewer adalah putih/transparent-checker, namun saat dirender bisa berubah putih solid. Buka menu **Render > Output Settings**, pilih format file `PNG` atau `TIF`, lalu pastikan saluran warna diatur ke `RGBA` (red green blue alpha). Dengan begitu, area tanpa gambar akan otomatis bernilai transparan.",
      en: "In OpenToonz, the viewer background defaults to white or a transparency grid checkerboard, but exports might default to solid white. Head over to **Render > Output Settings**, swap your file format to `PNG` or `TIF`, and explicitly make sure the color channel options are checked to `RGBA` (red green blue alpha). This forces empty backdrop regions to remain transparent."
    }
  }
];