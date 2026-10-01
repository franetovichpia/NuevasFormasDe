import { normalizeText } from "@/data/categories";

/**
 * Redes sociales de las entrevistas. Las conocidas tienen ícono, color y
 * se reconocen por el link; cualquier otra que se escriba en la planilla
 * (columna "plataforma" u hoja "Configuración") se agrega con ícono genérico.
 */

export type PlatformInfo = {
  slug: string;
  label: string;
};

type KnownPlatform = PlatformInfo & {
  aliases: readonly string[];
  hosts: readonly string[];
};

export const knownPlatforms: readonly KnownPlatform[] = [
  {
    slug: "youtube",
    label: "YouTube",
    aliases: ["youtube", "yt"],
    hosts: ["youtube.com", "youtu.be"],
  },
  {
    slug: "instagram",
    label: "Instagram",
    aliases: ["instagram", "ig", "insta"],
    hosts: ["instagram.com"],
  },
  {
    // Se mantiene "podcast" como identificador por compatibilidad.
    slug: "podcast",
    label: "Podcast",
    aliases: ["spotify", "podcast"],
    hosts: [
      "spotify.com",
      "spoti.fi",
      "spotify.link",
    ],
  },
  {
    slug: "tiktok",
    label: "TikTok",
    aliases: ["tiktok", "tik tok"],
    hosts: ["tiktok.com"],
  },
  {
    slug: "facebook",
    label: "Facebook",
    aliases: ["facebook", "fb"],
    hosts: ["facebook.com", "fb.watch"],
  },
  {
    slug: "x",
    label: "X",
    aliases: ["x", "twitter"],
    hosts: ["x.com", "twitter.com"],
  },
  {
    slug: "twitch",
    label: "Twitch",
    aliases: ["twitch"],
    hosts: ["twitch.tv"],
  },
  {
    slug: "vimeo",
    label: "Vimeo",
    aliases: ["vimeo"],
    hosts: ["vimeo.com"],
  },
];

/** Redes que se muestran en el filtro si no hay hoja de configuración. */
export const defaultPlatformSlugs = [
  "youtube",
  "instagram",
  "podcast",
];

function findKnownByName(value: string) {
  const normalizedValue =
    normalizeText(value);

  return knownPlatforms.find((platform) =>
    platform.aliases.includes(normalizedValue),
  );
}

function hostMatches(
  hostname: string,
  host: string,
) {
  return (
    hostname === host ||
    hostname.endsWith(`.${host}`)
  );
}

/**
 * Red a partir de su nombre ("YouTube", "spotify", "TikTok"). Si no es
 * una conocida, crea una nueva con el nombre tal cual se escribió.
 */
export function resolvePlatformName(
  value: string,
): PlatformInfo | null {
  const text = value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30);

  const normalizedValue = normalizeText(text);

  if (!normalizedValue) {
    return null;
  }

  const known = findKnownByName(text);

  if (known) {
    return {
      slug: known.slug,
      label: known.label,
    };
  }

  return {
    slug: normalizedValue.replace(/ /g, "-"),
    label:
      text.charAt(0).toUpperCase() +
      text.slice(1),
  };
}

/**
 * Red a partir del link. Reconoce las conocidas y también las que estén
 * en la hoja de configuración (por ejemplo "Rumble" en rumble.com).
 */
export function detectPlatformFromLink(
  link: string,
  extraPlatforms: readonly PlatformInfo[] = [],
): PlatformInfo | null {
  let hostname: string;

  try {
    hostname = new URL(
      link,
    ).hostname.toLowerCase();
  } catch {
    return null;
  }

  const known = knownPlatforms.find(
    (platform) =>
      platform.hosts.some((host) =>
        hostMatches(hostname, host),
      ),
  );

  if (known) {
    return {
      slug: known.slug,
      label: known.label,
    };
  }

  const extra = extraPlatforms.find(
    (platform) =>
      platform.slug.length > 2 &&
      hostname
        .split(".")
        .includes(
          platform.slug.replace(/-/g, ""),
        ),
  );

  return extra ?? null;
}

export function isKnownPlatform(
  slug: string,
) {
  return knownPlatforms.some(
    (platform) => platform.slug === slug,
  );
}

/** Nombre para mostrar de una red guardada. */
export function getPlatformLabel(
  slug: string,
  savedLabel?: string,
) {
  return (
    knownPlatforms.find(
      (platform) => platform.slug === slug,
    )?.label ??
    savedLabel ??
    slug.charAt(0).toUpperCase() +
      slug.slice(1).replace(/-/g, " ")
  );
}

/**
 * Redes para el filtro: las de la hoja "Configuración" (o YouTube,
 * Instagram y Spotify si no hay) y después las que aparezcan en las
 * entrevistas y no estén en esa lista.
 */
export function getPlatformOptions(
  conversations: readonly {
    media: readonly {
      platform: string;
      platformLabel?: string;
    }[];
  }[],
  configured?: readonly string[],
): PlatformInfo[] {
  const options: PlatformInfo[] = [];

  const add = (platform: PlatformInfo | null) => {
    if (
      platform &&
      !options.some(
        (item) => item.slug === platform.slug,
      )
    ) {
      options.push(platform);
    }
  };

  for (const value of configured ?? []) {
    add(resolvePlatformName(value));
  }

  if (options.length === 0) {
    for (const slug of defaultPlatformSlugs) {
      add({
        slug,
        label: getPlatformLabel(slug),
      });
    }
  }

  for (const conversation of conversations) {
    for (const media of conversation.media) {
      add({
        slug: media.platform,
        label: getPlatformLabel(
          media.platform,
          media.platformLabel,
        ),
      });
    }
  }

  return options;
}
