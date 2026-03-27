#!/bin/sh
set -e

npx prisma db push
npm run seed
npm run start
