# Docker Setup

`docker-compose.yml` builds the Açık Kuran API from a clone of [ResulKarahasanMD/acikkuran-api](https://github.com/ResulKarahasanMD/acikkuran-api) (default path `../../public/acikkuran-api`, override with `ACIKKURAN_API_DIR`). Upstream `ziegfiroyt/acikkuran-api` has no `Dockerfile` and cannot connect to a local non-SSL Postgres.

The container needs PostgreSQL and Meilisearch running on the host, with the `acikkuran` database built by `tools/build_db` in the API repository. See [README.md](README.md#2-set-up-the-açık-kuran-api) for the one-time setup.

Start the Açık Kuran API:

```bash
brew services run postgresql@17 meilisearch
docker compose up -d
```

The API will be available at http://localhost:3112

| Variable | Default | Purpose |
|---|---|---|
| `ACIKKURAN_API_DIR` | `../../public/acikkuran-api` | API build context |
| `ACIKKURAN_DB_URL` | `postgres://$USER@host.docker.internal:5432/acikkuran` | Postgres connection; the role defaults to your shell user (`postgres` if `USER` is unset) |
| `ACIKKURAN_DB_SSL` | `false` | Set to anything else for a Postgres that requires SSL |
| `MEILI_HOST` | `http://host.docker.internal:7700` | Meilisearch for `/search` |
