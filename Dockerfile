# Using Node.js Alpine as the base image
FROM node:alpine

# Seting the working directory inside the container
WORKDIR /proj

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copying the rest of the application code
COPY . .

# Exposing the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
