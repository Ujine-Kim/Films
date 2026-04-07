export interface Film {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  year: number;
  duration: number; // minutes
  genre: string;
  genreRu: string;
  tagline: string;
  taglineRu: string;
  synopsis: string;
  synopsisRu: string;
  poster: string; // gradient + color used as placeholder
  accentColor: string;
  awards: { source: string; quote: string; quoteRu: string }[];
  rentPrice: number; // USD
  buyPrice: number;  // USD
  trailerFile: string; // filename in /videos/
  filmFile: string;    // filename in /videos/
}

export const films: Film[] = [
  {
    id: "1",
    slug: "the-lyrics",
    title: "The Lyrics",
    titleRu: "Стих",
    year: 2025,
    duration: 11,
    genre: "Short Film",
    genreRu: "Короткий метр",
    tagline: "A soundrama about love and creativity.",
    taglineRu: "Саундрама о любви и творчестве.",
    synopsis: "A soundrama about love and creativity. Three stories of lovers who separate in some dimensions and meet in others.",
    synopsisRu: "Саундрама о любви и творчестве. Три истории о влюбленных, которые расстаются в одних измерениях и встречаются в других.",
    poster: "/images/posters/the-lyrics.png",
    accentColor: "#c4b08a",
    awards: [],
    rentPrice: 3.99,
    buyPrice: 9.99,
    trailerFile: "the-lyrics-trailer.mov",
    filmFile: "the-lyrics-full.mov"
  },
  {
    id: "2",
    slug: "the-drift",
    title: "The Drift",
    titleRu: "Дрейф",
    year: 2026,
    duration: 44,
    genre: "Documentary",
    genreRu: "Документальный фильм",
    tagline: "A husband and wife travel to Iran to find their missing son.",
    taglineRu: "История мужа и жены, которые отправляются в Иран найти пропавшего сына.",
    synopsis: "A husband and wife embark on a journey across Iran searching for their missing son — a road film about loss, hope, and the distances between people.",
    synopsisRu: "Муж и жена отправляются в путешествие по Ирану в поисках пропавшего сына — роуд-муви о потере, надежде и расстояниях между людьми.",
    poster: "/images/posters/the-drift.png",
    accentColor: "#c47a4a",
    awards: [],
    rentPrice: 3.99,
    buyPrice: 9.99,
    trailerFile: "the-drift-trailer.mov",
    filmFile: "the-drift-full.mov"
  }
];

export interface Director {
  nameEn: string;
  nameRu: string;
  bioEn: string;
  bioRu: string;
  photo: string;
  based: string;
  basedRu: string;
}

export const director: Director = {
  nameEn: "Armenak",
  nameRu: "Арменак",
  bioEn: "Armenak is an Armenian filmmaker working at the intersection of documentary and fiction. His films explore memory, landscape, and the quiet tension between belonging and loss. He has shown work at festivals across Europe and the South Caucasus.",
  bioRu: "Арменак — армянский режиссёр, работающий на пересечении документального и игрового кино. Его фильмы исследуют память, пейзаж и тихое напряжение между принадлежностью и утратой. Его работы показывались на фестивалях по всей Европе и Южному Кавказу.",
  photo: "",
  based: "Yerevan / Amsterdam",
  basedRu: "Ереван / Амстердам"
};
