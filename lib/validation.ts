/**
 * Limpieza y validación de los textos que llegan desde el panel.
 */

// Caracteres de control invisibles (se conservan tabulación y saltos de línea
// solo en los textos de varias líneas).
const CONTROL_CHARACTERS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\u202A-\u202E\u2066-\u2069\uFEFF]/g;

const HAS_CONTROL_CHARACTERS = new RegExp(
  CONTROL_CHARACTERS.source,
);

const LINE_BREAKS = /[\r\n\t]+/g;

export function cleanText(
  value: unknown,
  maxLength: number,
  options: {
    multiline?: boolean;
  } = {},
) {
  if (typeof value !== "string") {
    return "";
  }

  let text = value
    .normalize("NFC")
    .replace(CONTROL_CHARACTERS, "");

  text = options.multiline
    ? text
        .replace(/\r\n?/g, "\n")
        .replace(/\n{4,}/g, "\n\n\n")
    : text.replace(LINE_BREAKS, " ");

  return text
    .replace(/[ \t]{2,}/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Usuario: letras, números, punto, guion y guion bajo. */
export const USERNAME_PATTERN =
  "[A-Za-z0-9._\\-]{2,40}";

const usernameRegex = new RegExp(
  `^${USERNAME_PATTERN}$`,
);

export function isValidUsername(
  value: string,
) {
  return usernameRegex.test(value);
}

export const PASSWORD_MAX_LENGTH = 128;

export function isValidPassword(
  value: string,
) {
  return (
    value.length > 0 &&
    value.length <= PASSWORD_MAX_LENGTH &&
    !HAS_CONTROL_CHARACTERS.test(value)
  );
}
