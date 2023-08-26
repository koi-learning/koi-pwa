FROM nginx:stable-alpine3.17

# copy the dist folder and unzip it
COPY dist.zip /dist.zip
RUN unzip -o -q dist.zip -d /
RUN cp -rf /dist/* /usr/share/nginx/html/

COPY nginx-template.conf /nginx-template.conf

ENV PORT 80
ENV DOLLAR $
ENV API_URL http://localhost:8080
ENV MAX_PAYLOAD_SIZE 500M

EXPOSE 80

ENTRYPOINT ["/bin/sh", "-c", "envsubst < /nginx-template.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
