# Installation
아래의 명령어를 실행하여 플러그인을 설치한다.
```
$ npm install
```

# Usage
아래의 명령어를 실행하여 빌드 혹은 로컬에서 실행한다.
## 빌드
```
$ yarn build
```
## 실행
```
$ yarn start
```

# docker
아래의 명령어를 실행하여 Docker Image 를 생성 및 실행한다.
## 생성
```
$ docker build --tag dosbox-react-demo:0.0.1 .
```
## 실행
```
$ docker run -d -p 8090:8090 --name dosbox-react-demo dosbox-react-demo:0.0.1
```

# Document
[React 가이드](https://ko.reactjs.org)  
[JS-DOS 참고문서](https://js-dos.com/#js-dos-622)

# Issue