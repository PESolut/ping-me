#!/bin/bash

# Create main directories
mkdir -p backend/{__tests__/integration,src/{controllers,models,routes}}

# Create files
touch backend/__tests__/integration/{auth.test.js,chat.test.js,message.test.js}
touch backend/__tests__/setup.js
touch backend/src/app.js
touch backend/{package.json,jest.config.js}

echo "File structure created successfully!"



echo "Done! Your backend structure is ready."