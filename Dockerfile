FROM nginx:stable-alpine

# 배포 디렉토리 생성
RUN mkdir /usr/share/web/

# 작업 디렉토리 설정
WORKDIR /usr/share/web/

# local 의 build 디렉토리를 docker 의 /usr/share/nginx/web/ 디렉토리로 복사
ADD ./build ./

# local 의 nginx 설정을 docker 로 복사
ADD ./nginx/dosbox.conf /etc/nginx/conf.d/dosbox.conf

# nginx 설정 권한 수정
RUN chmod 640 /etc/nginx/nginx.conf /etc/nginx/conf.d/*.conf

## port 설정
EXPOSE 8090

ENTRYPOINT ["nginx", "-g", "daemon off;"]