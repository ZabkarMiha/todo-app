First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


You will need to create a .env and .env.local file and insert your DATABASE_URL

Then, if you would like, you can seed the database:
```bash
npm run seed --dotenv_config_path=.env.local
```
