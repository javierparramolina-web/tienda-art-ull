GUÍA DE DESPLIEGUE EN VERCEL (Recomendado)

Vercel es la mejor opción: es gratis, rápido y funciona seguro.
El único cambio es que no usaremos el archivo `prod.db` (SQLite) sino una base de datos en la nube (Postgres) que Vercel te regala.

PASO 1: SUBIR A GITHUB
1. Crea un repositorio en tu [GitHub](https://github.com/new) llamado `tienda-art-ull`.
2. Sube los archivos de tu carpeta `tienda` (¡NO la carpeta `deploy`, sino la carpeta original donde trabajamos!).
   - Si no sabes usar git por terminal, puedes usar "GitHub Desktop" o arrastrar los archivos en la web de GitHub (aunque es peor).
   - Lo ideal es:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/tienda-art-ull.git
     git push -u origin main
     ```

PASO 2: IMPORTAR EN VERCEL
1. Ve a [vercel.com](https://vercel.com) y regístrate (o entra con GitHub).
2. Dale a "Add New..." -> "Project".
3. Busca tu repositorio `tienda-art-ull` y dale a "Import".

PASO 3: CONFIGURAR BASE DE DATOS (Storage)
**ANTES DE DARLE A DEPLOY:**
1. En la pantalla de configuración de Vercel, verás un menú a la izquierda o pestaña que pone "Storage" (o cuando crees el proyecto).
2. Si no lo ves ahí, crea el proyecto primero. Fallará el deploy (es normal).
3. Ve a la pestaña **Storage** del proyecto en Vercel.
4. Dale a **"Connect Store"** -> **"Postgres"** (Create New).
5. Dale un nombre (ej: `tienda-db`), elige región (ej: Frankfurt `fra1` o Washington `iad1`).
6. Dale a "Connect".

Esto añadirá automáticamente las variables de entorno de la base de datos (`POSTGRES_PRISMA_URL`, etc).

PASO 4: VARIABLES DE ENTORNO EXTAS
Ve a **Settings -> Environment Variables** y añade las que faltan (copia las de tu `.env.local`):

- `NEXTAUTH_URL`: https://tu-nombre-proyecto.vercel.app (o tu dominio real)
- `NEXTAUTH_SECRET`: (Pon una cadena larga y segura)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: ...
- `STRIPE_SECRET_KEY`: ...
- `EMAIL_USER`: resend
- `EMAIL_PASS`: re_...
- `EMAIL_FROM`: onboarding@resend.dev (o tu email verificado)

PASO 5: REDEPLOY
1. Ve a la pestaña **Deployments**.
2. Dale a los 3 puntitos del último deploy (el que falló) -> **Redeploy**.
3. Ahora debería construir todo, conectarse a la base de datos y funcionar.

¡Listo! Tendrás tu tienda online en `https://tienda-art-ull.vercel.app`.
