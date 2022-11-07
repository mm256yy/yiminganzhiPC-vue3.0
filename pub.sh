npm i

npm run build:prod

docker build -t registry.cn-hangzhou.aliyuncs.com/jmax/migrate-web:latest .

docker push registry.cn-hangzhou.aliyuncs.com/jmax/migrate-web:latest