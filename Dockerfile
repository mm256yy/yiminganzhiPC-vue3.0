FROM nginx:alpine

COPY dist-prod/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
