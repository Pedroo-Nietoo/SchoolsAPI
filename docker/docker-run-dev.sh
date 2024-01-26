echo "STARTING DEVICES SERVICE"
# rm -rf node_modules
# Install the project dependencies
npm install --quiet --no-optional --no-fund --loglevel=error
# yarn install
# Generate Prisma Client
npx prisma generate
# Create migrations from Prisma schema, apply them to the database, generate artifacts
npx prisma migrate dev
# Start the API server on development mode
npm run start:dev