FROM nginx:alpine
#ensure to ng build first
COPY dist/weighing-software-ui /usr/share/nginx/html

#building docker image
#docker build -t wbs-ui .

#running docker image
#docker run -p 8080:80 wbs-ui