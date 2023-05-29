export enum Response {
	DATABASE_ERROR = 'Adatbázis hiba',
	USER_CREATE_ERROR = 'Felhasználó létrehozása nem sikerült',
	NO_USER_FOUND = 'Nem létezik ilyen felhasználó',
	WRONG_NAME_OR_PASS = 'Hibás felhasználónév vagy jelszó',
	NO_PASSWORD_SET = 'NO_PASSWORD_SET',
	PASSWORD_ALREADY_SET = 'Jelszó már be lett állítva',
	USERNAME_TAKEN = 'A felhasználónév már foglalt',
	CASE_CREATE_ERROR = 'Az ügy létrehozása nem sikerült',
	MUST_NOT_BE_EMPTY = 'A mező nem lehet üres',
	USER_NOT_SUBSCRIBED = 'Ezzel az email címmel előfizető nem létezik',
	MUST_BE_EMAIL = 'Érvényes email címet adj meg'
}
