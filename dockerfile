# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY . /usr/src/app

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . . 

# Build the application using npm
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]