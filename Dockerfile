# Dockerfile for maths_Quiz static site
# Use a lightweight Nginx image to serve the HTML/JS/CSS files

FROM nginx:alpine

# Copy the entire project into the Nginx html directory
COPY . /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Nginx runs in the foreground by default, no CMD needed

