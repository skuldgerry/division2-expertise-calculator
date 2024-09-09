# Use an official Nginx image as a base
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy only the necessary files
COPY index.html .
COPY styles/ ./styles/
COPY scripts/ ./scripts/
COPY data/ ./data/

# Expose port 80 to the outside world
EXPOSE 80

