#基础镜像
FROM openjdk
#作者
MAINTAINER LeeYiuTing
#系统编码
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
#声明一个挂载点，容器内此路径会对应宿主机的某个文件夹
VOLUME /tmp
#应用构建成功后的jar文件被复制到镜像内，名字也改成了app.jar
ADD target/ktCat.jar app.jar
#启动容器时的进程
ENTRYPOINT ["java","-jar","/app.jar"]
#暴露80端口
EXPOSE 8023