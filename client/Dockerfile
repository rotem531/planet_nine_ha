# Step 1: Use an official Node.js image to build the React app
FROM node:16 as build

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Use an official Nginx image to serve the frontend
FROM nginx:alpine

# Step 8: Copy the build files to the Nginx web directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Step 9: Expose the port that Nginx will use to serve the app
EXPOSE 80

# Step 10: Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
