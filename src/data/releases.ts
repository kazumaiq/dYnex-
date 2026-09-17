// dYnex? — Official Verified Discography Catalog (2023—2026)
// Automatically verified and synced from Apple Music API & Official Distribution Channels

export interface ReleasePlatformLinks {
  appleMusic?: string;
  spotify?: string;
  youtube?: string;
  youtubeMusic?: string;
  yandexMusic?: string;
  vk?: string;
  soundCloud?: string;
  deezer?: string;
  amazonMusic?: string;
  bandcamp?: string;
}

export interface Release {
  id: string;
  title: string;
  artists: string;
  year: number;
  date: string;
  type: 'SINGLE' | 'EP' | 'ALBUM';
  genre: string;
  artworkUrl: string;
  description?: string;
  trackCount: number;
  featured?: boolean;
  published?: boolean;
  verified: boolean;
  verificationStatus: 'VERIFIED' | 'MANUAL' | 'UNVERIFIED';
  platforms: ReleasePlatformLinks;
  appleMusicId?: number;
  isrc?: string;
  label?: string;
}

export const INITIAL_FEATURED_ID = 'dynex-1870622927'; // Abstract (dYnex? & VERV!X)

export const VERIFIED_RELEASES: Release[] = [
  {
    "id": "dynex-1870622927",
    "title": "Abstract",
    "artists": "dYnex? & VERV!X",
    "year": 2026,
    "date": "2026-01-30",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4c/bd/09/4cbd09b3-e559-c241-6a7d-2101dc0c4157/cover.png/1000x1000bb.jpg",
    "description": "Официальный релиз Abstract от dYnex? & VERV!X. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 1,
    "featured": true,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/abstract-single/1870622927?uo=4",
      "spotify": "https://open.spotify.com/search/Abstract%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Abstract%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Abstract%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Abstract%20dYnex%3F"
    },
    "appleMusicId": 1870622927
  },
  {
    "id": "dynex-1845328978",
    "title": "K+!UN",
    "artists": "gveor & dYnex?",
    "year": 2025,
    "date": "2025-11-07",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a9/ff/a1/a9ffa15e-6db3-b81a-be5c-c668c6b03b27/cover.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз K+!UN от gveor & dYnex?. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 3,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/k-un-single/1845328978?uo=4",
      "spotify": "https://open.spotify.com/search/K%2B!UN%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=K%2B!UN%20dYnex%3F",
      "vk": "https://vk.com/audio?q=K%2B!UN%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=K%2B!UN%20dYnex%3F"
    },
    "appleMusicId": 1845328978
  },
  {
    "id": "dynex-1845328253",
    "title": "Exhaustion",
    "artists": "gveor & dYnex?",
    "year": 2025,
    "date": "2025-10-31",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/cd/8c/d4/cd8cd432-b303-f9e4-d0bd-e7362efe8246/cover.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Exhaustion от gveor & dYnex?. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 3,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/exhaustion-single/1845328253?uo=4",
      "spotify": "https://open.spotify.com/search/Exhaustion%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Exhaustion%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Exhaustion%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Exhaustion%20dYnex%3F"
    },
    "appleMusicId": 1845328253
  },
  {
    "id": "dynex-1846182147",
    "title": "MONTAGEM BATERIA",
    "artists": "dYnex? & gveor",
    "year": 2025,
    "date": "2025-10-17",
    "type": "EP",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/07/cf/11/07cf11e3-559c-b9e7-3461-6ee3a8833427/cover.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз MONTAGEM BATERIA от dYnex? & gveor. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 4,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/montagem-bateria-ep/1846182147?uo=4",
      "spotify": "https://open.spotify.com/search/MONTAGEM%20BATERIA%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=MONTAGEM%20BATERIA%20dYnex%3F",
      "vk": "https://vk.com/audio?q=MONTAGEM%20BATERIA%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=MONTAGEM%20BATERIA%20dYnex%3F"
    },
    "appleMusicId": 1846182147
  },
  {
    "id": "dynex-1837462874",
    "title": "Fica quieto",
    "artists": "TRVNSPORTER & dYnex?",
    "year": 2025,
    "date": "2025-09-05",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/82/77/a8/8277a80d-9133-e8d5-150c-0626e8f6ffa2/199538675702.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Fica quieto от TRVNSPORTER & dYnex?. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 3,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/fica-quieto-single/1837462874?uo=4",
      "spotify": "https://open.spotify.com/search/Fica%20quieto%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Fica%20quieto%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Fica%20quieto%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Fica%20quieto%20dYnex%3F"
    },
    "appleMusicId": 1837462874
  },
  {
    "id": "dynex-1834506465",
    "title": "Broca",
    "artists": "TRVNSPORTER & dYnex?",
    "year": 2025,
    "date": "2025-08-22",
    "type": "EP",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/78/4b/dd/784bddac-0a80-f71c-93c6-829734a73293/cover.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Broca от TRVNSPORTER & dYnex?. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 4,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/broca-ep/1834506465?uo=4",
      "spotify": "https://open.spotify.com/search/Broca%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Broca%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Broca%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Broca%20dYnex%3F"
    },
    "appleMusicId": 1834506465
  },
  {
    "id": "dynex-1807766579",
    "title": "KRIDO",
    "artists": "dYnex?",
    "year": 2025,
    "date": "2025-04-11",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/15/f6/31/15f631bb-34b9-f2cb-df9f-f7c16b9eb56a/cover.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз KRIDO от dYnex?. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/krido-single/1807766579?uo=4",
      "spotify": "https://open.spotify.com/search/KRIDO%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=KRIDO%20dYnex%3F",
      "vk": "https://vk.com/audio?q=KRIDO%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=KRIDO%20dYnex%3F"
    },
    "appleMusicId": 1807766579
  },
  {
    "id": "dynex-1805935208",
    "title": "Sx1 (Slowed Down)",
    "artists": "dYnex?, Sx1nxwy & prodbydxm",
    "year": 2025,
    "date": "2025-04-11",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ce/37/3e/ce373e9e-c85d-2f1c-f825-7249d51654c8/199350203374.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Sx1 (Slowed Down) от dYnex?, Sx1nxwy & prodbydxm. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/time-to-jump-slowed/1805935208?i=1805936287&uo=4",
      "spotify": "https://open.spotify.com/search/Sx1%20(Slowed%20Down)%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Sx1%20(Slowed%20Down)%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Sx1%20(Slowed%20Down)%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Sx1%20(Slowed%20Down)%20dYnex%3F"
    },
    "appleMusicId": 1805935208
  },
  {
    "id": "dynex-1788661582",
    "title": "Suphire",
    "artists": "dYnex?, ZomboBox! & prodbydxm",
    "year": 2025,
    "date": "2025-01-10",
    "type": "SINGLE",
    "genre": "House",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a5/26/bf/a526bfa6-7cff-06f1-2296-af01dd891580/5063287440704.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Suphire от dYnex?, ZomboBox! & prodbydxm. Официальный каталог Apple Music. Жанр: House.",
    "trackCount": 3,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/suphire-single/1788661582?uo=4",
      "spotify": "https://open.spotify.com/search/Suphire%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Suphire%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Suphire%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Suphire%20dYnex%3F"
    },
    "appleMusicId": 1788661582
  },
  {
    "id": "dynex-1788976054",
    "title": "Time To Jump",
    "artists": "dYnex?, Sx1nxwy & prodbydxm",
    "year": 2025,
    "date": "2025-01-10",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/70/92/75/7092757e-dd27-4abd-1006-2c7acb899e3f/199066486757.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Time To Jump от dYnex?, Sx1nxwy & prodbydxm. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/time-to-jump-single/1788976054?uo=4",
      "spotify": "https://open.spotify.com/search/Time%20To%20Jump%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Time%20To%20Jump%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Time%20To%20Jump%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Time%20To%20Jump%20dYnex%3F"
    },
    "appleMusicId": 1788976054
  },
  {
    "id": "dynex-1736746938",
    "title": "Oper Club (Deluxe)",
    "artists": "dYnex? & QWERRET",
    "year": 2024,
    "date": "2024-03-20",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0d/f5/bf/0df5bfd7-4164-8d01-1fac-9f6bb018b26a/4631165403427.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Oper Club (Deluxe) от dYnex? & QWERRET. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/oper-club-deluxe-single/1736746938?uo=4",
      "spotify": "https://open.spotify.com/search/Oper%20Club%20(Deluxe)%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Oper%20Club%20(Deluxe)%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Oper%20Club%20(Deluxe)%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Oper%20Club%20(Deluxe)%20dYnex%3F"
    },
    "appleMusicId": 1736746938
  },
  {
    "id": "dynex-1736176892",
    "title": "Cold of Heart",
    "artists": "dYnex? & NIGHT MESS",
    "year": 2024,
    "date": "2024-03-18",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/83/e2/34/83e23423-5202-4f7c-8ef2-b395def1f713/4631165397658.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Cold of Heart от dYnex? & NIGHT MESS. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/cold-of-heart-single/1736176892?uo=4",
      "spotify": "https://open.spotify.com/search/Cold%20of%20Heart%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Cold%20of%20Heart%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Cold%20of%20Heart%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Cold%20of%20Heart%20dYnex%3F"
    },
    "appleMusicId": 1736176892
  },
  {
    "id": "dynex-1729838275",
    "title": "Level Up",
    "artists": "dYnex?, MITUJURO, M1TRVGE & PRXSXNT",
    "year": 2024,
    "date": "2024-02-09",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/75/37/ab/7537abd9-ec38-c0ca-a823-9d0d8f68cc70/4631165317946.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Level Up от dYnex?, MITUJURO, M1TRVGE & PRXSXNT. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 2,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/level-up-single/1729838275?uo=4",
      "spotify": "https://open.spotify.com/search/Level%20Up%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Level%20Up%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Level%20Up%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Level%20Up%20dYnex%3F"
    },
    "appleMusicId": 1729838275
  },
  {
    "id": "dynex-1725837493",
    "title": "The Beginning of a New",
    "artists": "SX1ENT & dYnex?",
    "year": 2024,
    "date": "2024-01-26",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/04/21/36/042136ec-a845-3cc3-4ace-a50204b4f42e/4631165251707.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз The Beginning of a New от SX1ENT & dYnex?. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/the-beginning-of-a-new-single/1725837493?uo=4",
      "spotify": "https://open.spotify.com/search/The%20Beginning%20of%20a%20New%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=The%20Beginning%20of%20a%20New%20dYnex%3F",
      "vk": "https://vk.com/audio?q=The%20Beginning%20of%20a%20New%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=The%20Beginning%20of%20a%20New%20dYnex%3F"
    },
    "appleMusicId": 1725837493
  },
  {
    "id": "dynex-1726468819",
    "title": "Faded Forever",
    "artists": "dYnex? & Houle",
    "year": 2024,
    "date": "2024-01-19",
    "type": "SINGLE",
    "genre": "Electronica",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2a/27/8a/2a278ad6-1a60-0ade-f2cb-4d5466450a7f/4631165257488.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Faded Forever от dYnex? & Houle. Официальный каталог Apple Music. Жанр: Electronica.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/faded-forever-single/1726468819?uo=4",
      "spotify": "https://open.spotify.com/search/Faded%20Forever%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Faded%20Forever%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Faded%20Forever%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Faded%20Forever%20dYnex%3F"
    },
    "appleMusicId": 1726468819
  },
  {
    "id": "dynex-1725501530",
    "title": "Second Life",
    "artists": "BRXTEFXRCE & dYnex?",
    "year": 2024,
    "date": "2024-01-11",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/34/84/05/348405e0-b9de-73b5-bf63-a8ce8ea95c4f/4631165248097.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Second Life от BRXTEFXRCE & dYnex?. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/second-life-single/1725501530?uo=4",
      "spotify": "https://open.spotify.com/search/Second%20Life%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Second%20Life%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Second%20Life%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Second%20Life%20dYnex%3F"
    },
    "appleMusicId": 1725501530
  },
  {
    "id": "dynex-1723496721",
    "title": "Consequences",
    "artists": "dYnex?, YOUNGSOCIE & senpai★",
    "year": 2023,
    "date": "2023-12-29",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ad/44/57/ad44577c-79d7-32da-8dfa-21c34521aa6d/4631165234960.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Consequences от dYnex?, YOUNGSOCIE & senpai★. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 3,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/consequences-single/1723496721?uo=4",
      "spotify": "https://open.spotify.com/search/Consequences%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Consequences%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Consequences%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Consequences%20dYnex%3F"
    },
    "appleMusicId": 1723496721
  },
  {
    "id": "dynex-1717326794",
    "title": "HYPNODANCE",
    "artists": "dYnex? & lvoomba",
    "year": 2023,
    "date": "2023-11-19",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3c/4c/b8/3c4cb887-f604-a8eb-86b2-cc82c2f32692/4631165189451.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз HYPNODANCE от dYnex? & lvoomba. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 2,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/hypnodance-single/1717326794?uo=4",
      "spotify": "https://open.spotify.com/search/HYPNODANCE%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=HYPNODANCE%20dYnex%3F",
      "vk": "https://vk.com/audio?q=HYPNODANCE%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=HYPNODANCE%20dYnex%3F"
    },
    "appleMusicId": 1717326794
  },
  {
    "id": "dynex-1714512323",
    "title": "Serenity (Deluxe)",
    "artists": "dYnex? & DXNZØ",
    "year": 2023,
    "date": "2023-11-02",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/92/0b/13/920b1311-8758-808f-a040-85a1067864e5/4631165172507.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Serenity (Deluxe) от dYnex? & DXNZØ. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/serenity-deluxe-single/1714512323?uo=4",
      "spotify": "https://open.spotify.com/search/Serenity%20(Deluxe)%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Serenity%20(Deluxe)%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Serenity%20(Deluxe)%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Serenity%20(Deluxe)%20dYnex%3F"
    },
    "appleMusicId": 1714512323
  },
  {
    "id": "dynex-1714512216",
    "title": "Lumminate",
    "artists": "dYnex? & SXNDXD",
    "year": 2023,
    "date": "2023-10-30",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ba/32/3c/ba323c55-f33c-924b-839d-7d7ef4245e35/4631165172491.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Lumminate от dYnex? & SXNDXD. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/lumminate-single/1714512216?uo=4",
      "spotify": "https://open.spotify.com/search/Lumminate%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Lumminate%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Lumminate%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Lumminate%20dYnex%3F"
    },
    "appleMusicId": 1714512216
  },
  {
    "id": "dynex-1758073431",
    "title": "Doom Override",
    "artists": "dYnex? & we'll!tonight",
    "year": 2023,
    "date": "2023-08-22",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2e/47/31/2e4731e0-4a60-c483-0611-1de79080057b/cover.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Doom Override от dYnex? & we'll!tonight. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/doom-override-single/1758073431?uo=4",
      "spotify": "https://open.spotify.com/search/Doom%20Override%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Doom%20Override%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Doom%20Override%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Doom%20Override%20dYnex%3F"
    },
    "appleMusicId": 1758073431
  },
  {
    "id": "dynex-1758062743",
    "title": "Bring It On",
    "artists": "dYnex? & endlxss",
    "year": 2023,
    "date": "2023-08-21",
    "type": "SINGLE",
    "genre": "Electronic",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1e/25/ea/1e25eaab-db5a-1dba-6020-a71eb6d2507e/cover.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Bring It On от dYnex? & endlxss. Официальный каталог Apple Music. Жанр: Electronic.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/bring-it-on-single/1758062743?uo=4",
      "spotify": "https://open.spotify.com/search/Bring%20It%20On%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Bring%20It%20On%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Bring%20It%20On%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Bring%20It%20On%20dYnex%3F"
    },
    "appleMusicId": 1758062743
  },
  {
    "id": "dynex-1698019183",
    "title": "Cyber Memories",
    "artists": "dYnex? & endlxss",
    "year": 2023,
    "date": "2023-07-14",
    "type": "SINGLE",
    "genre": "Hip-Hop/Rap",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f0/64/65/f064650b-5bd7-376a-8b9a-05799216f3b2/4631165062150.jpg/1000x1000bb.jpg",
    "description": "Официальный релиз Cyber Memories от dYnex? & endlxss. Официальный каталог Apple Music. Жанр: Hip-Hop/Rap.",
    "trackCount": 1,
    "featured": false,
    "published": true,
    "verified": true,
    "verificationStatus": "VERIFIED",
    "platforms": {
      "appleMusic": "https://music.apple.com/us/album/cyber-memories-single/1698019183?uo=4",
      "spotify": "https://open.spotify.com/search/Cyber%20Memories%20dYnex%3F",
      "youtube": "https://www.youtube.com/results?search_query=Cyber%20Memories%20dYnex%3F",
      "vk": "https://vk.com/audio?q=Cyber%20Memories%20dYnex%3F",
      "soundCloud": "https://soundcloud.com/search?q=Cyber%20Memories%20dYnex%3F"
    },
    "appleMusicId": 1698019183
  }
];
