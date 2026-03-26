# Aarunya Luxe - Full Stack Luxury Fashion E-Commerce

A complete full-stack luxury Indian fashion e-commerce project.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Axios
- **Backend:** Node.js + Express + MongoDB + JWT + Multer
- **Deployment:** Vercel (frontend) + Render (backend)

## Project Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── admin/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── context/
│   │   └── data/
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── uploads/
```

## Local Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (JWT + multipart image)
- `PUT /api/products/:id` (JWT + multipart image)
- `DELETE /api/products/:id` (JWT)
- `GET /api/orders` (JWT)
- `POST /api/orders` (JWT)

## Deployment

### Frontend on Vercel
1. Import `frontend` folder as project.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add env var `VITE_API_URL=https://<your-render-service>/api`.

### Backend on Render
1. Create a new **Web Service** with root directory `backend`.
2. Build command: `npm install`.
3. Start command: `npm start`.
4. Add environment variables from `.env.example`.
5. Set `CLIENT_URL` to your Vercel domain.

## Notes
- Tailwind is configured in `frontend/tailwind.config.js`.
- Admin dashboard UI is at `/admin` (requires auth token from `/auth`).
- Product detail page includes thumbnails, zoom-like hover, size/color selection, and complete-the-look carousel.
