#!/bin/bash
cd "$(dirname "$0")"
echo "Current directory: $(pwd)"
echo "Starting Next.js development server..."
./node_modules/.bin/next dev
