# Cum pornesti Inner Weather (backend + frontend)

Ai nevoie de **doua terminale Git Bash**: unul pentru backend, unul pentru frontend.
Ordinea conteaza: **Docker → backend → frontend**.

---

## 0. O singura data (sau dupa un `git pull` cu dependinte noi)

- **Docker Desktop** instalat.
- **Java 25** in `~/.jdks/openjdk-25` (IntelliJ il descarca acolo), setat ca Java implicit in Git Bash:
  ```bash
  echo 'export JAVA_HOME="$HOME/.jdks/openjdk-25"' >> ~/.bashrc
  ```
  Apoi redeschizi terminalul. Verificare: `echo $JAVA_HOME` arata calea spre `openjdk-25`.
- **Node.js** instalat (`node -v` sa raspunda).
- Dependintele frontend-ului:
  ```bash
  cd frontend
  npm install
  ```
  Ruleaza din nou `npm install` daca dupa un pull s-a schimbat `frontend/package.json`.

---

## 1. Ia ultimele schimbari

Din folderul `inner-weather`:
```bash
git switch main
git pull
```
Apoi treci pe branch-ul la care lucrezi (sau fa unul nou: `git switch -c fe/nume-feature`).

---

## 2. Porneste Docker Desktop

Deschide aplicatia si asteapta pana scrie **Engine running** (iconita din bara de jos devine verde).
Nu trebuie sa rulezi tu `docker compose up`: backend-ul porneste singur baza de date.

---

## 3. Backend (terminalul 1)

```bash
cd backend
./mvnw spring-boot:run
```

E gata cand vezi in log: **`Started ...Application in X seconds`**.

- API: `http://localhost:8080`
- Swagger (testezi endpoint-urile): http://localhost:8080/swagger-ui/index.html
- Baza de date: PostgreSQL 16 in Docker, pe portul **5433** (pe 5432 e Postgres-ul instalat pe Windows).

---

## 4. Frontend (terminalul 2)

```bash
cd frontend
npm run dev
```

Deschide adresa afisata: **http://localhost:5173**.
Cererile spre `/api` merg automat la backend (proxy in `vite.config.ts`).

---

## 5. Cont de test

- Email: `bogdan@test.com`
- Parola: `parola123`

Daca baza de date e noua (contul nu exista), il creezi din Swagger:
`POST /api/auth/register` cu
```json
{ "email": "bogdan@test.com", "password": "parola123" }
```

---

## 6. Oprire

- **Ctrl + C** in ambele terminale.
- Docker Desktop il poti inchide. Datele raman salvate (volumul `pgdata`).

---

## Cand ceva nu merge

| Ce vezi | Cauza | Ce faci |
|---|---|---|
| `failed to connect to the docker API ... dockerDesktopLinuxEngine` / `Cannot connect to the Docker daemon` | Docker Desktop nu e pornit | Pornesti Docker Desktop, astepti *Engine running*, repornesti backend-ul |
| `release version 27 not supported` (sau alta versiune) | Maven foloseste alt Java | Lipseste linia cu `JAVA_HOME` din `~/.bashrc` (vezi pasul 0) sau terminalul a fost deschis inainte s-o adaugi |
| `password authentication failed for user "iw"` | Backend-ul a nimerit Postgres-ul de pe Windows (5432) | Verifici ca `backend/compose.yaml` are `"5433:5432"` |
| `Port 8080 was already in use` | Un backend vechi inca ruleaza | Inchizi celalalt terminal sau Ctrl + C acolo |
| Pe login: *"The server isn't responding. Is the backend running?"* | Backend-ul nu e pornit sau a cazut | Te uiti in terminalul 1 |
| `vite: not found` / `npm ERR! ENOENT` | Lipsesc dependintele sau esti in folderul gresit | `cd frontend` apoi `npm install` |
| Intro-ul sare direct la login, fara animatii | Windows are animatiile oprite | Setari → Accesibilitate → Efecte vizuale → **Efecte de animatie: Pornit** |
| `Cannot find module ...` in VS Code, dar `npm run dev` merge | VS Code a ramas in urma | Ctrl + Shift + P → **TypeScript: Restart TS Server** |
