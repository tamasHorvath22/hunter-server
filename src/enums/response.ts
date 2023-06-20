export enum Response {
	USER_CREATE_ERROR = 'Felhasználó létrehozása nem sikerült',
	USERNAME_TAKEN = 'A felhasználónév már foglalt',
	CASE_CREATE_ERROR = 'Az ügy létrehozása nem sikerült',
	USER_NOT_SUBSCRIBED = 'Ezzel az email címmel előfizető nem létezik',
	MUST_BE_EMAIL = 'Érvényes email címet adj meg',
	CASE_NO_RIGHTS = 'Nincs joga megtekinteni ezt az ügyet',
	CASE_NOT_FOUND = 'Az ügy nem található',
	AREA_NOT_FOUND = 'Terület ilyen helyrajzi számmal nem található',
	MUST_BE_STRING = 'Szöveges értéknek kell lennie',
	AREA_ALREADY_EXISTS = 'Már létezik terület ezen a helyrajzi számon',
	INVALID_QUOTA_SUM = 'A tulajdonosi hányadok összege több mint 100%',
}
