# Source: https://github.com/theonemule/docker-waf
FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Budapest

# Update
RUN apt-get update -y && apt-get upgrade -y 

# Install and configure nginx
RUN apt install -y nginx

# Install/update dependencies 
RUN apt-get install -y git bison build-essential ca-certificates curl dh-autoreconf doxygen \
    flex gawk git iputils-ping libcurl4-gnutls-dev libexpat1-dev libgeoip-dev liblmdb-dev \
    libpcre3-dev libpcre++-dev libssl-dev libtool libxml2 libxml2-dev libyajl-dev locales \
    lua5.3-dev pkg-config wget zlib1g-dev zlibc libxslt-dev libgd-dev

# Install modsecurity
RUN cd /opt && git clone https://github.com/SpiderLabs/ModSecurity && cd ModSecurity && \
    git submodule init && git submodule update && \
    ./build.sh && ./configure && \
    make && make install 

# Install nginx-modsecurity connector
RUN cd /opt && git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

# Install nginx (v 1.18.0)
RUN cd /opt && wget http://nginx.org/download/nginx-1.18.0.tar.gz && \
    tar zxvf nginx-1.18.0.tar.gz && cd nginx-1.18.0 && \
    ./configure --add-dynamic-module=../ModSecurity-nginx --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-KTLRnK/nginx-1.18.0=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-compat --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_sub_module --with-http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-mail=dynamic --with-mail_ssl_module && \
    make modules

RUN mkdir /etc/nginx/modules && cp /opt/nginx-1.18.0/objs/ngx_http_modsecurity_module.so /usr/share/nginx/modules/ && \
    echo "load_module modules/ngx_http_modsecurity_module.so;" | cat - /etc/nginx/nginx.conf > temp && mv temp /etc/nginx/nginx.conf

# Remove default ruleset and replace
RUN rm -rf /usr/share/modsecurity-crs && git clone https://github.com/coreruleset/coreruleset /usr/local/modsecurity-crs && \
    mv /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf && \
    mv /usr/local/modsecurity-crs/crs-setup.conf.example /usr/local/modsecurity-crs/crs-setup.conf

# Configure modsecurity
RUN mkdir -p /etc/nginx/modsec && mkdir /etc/nginx/modsec/ModSecurity/ && \
    cp /opt/ModSecurity/unicode.mapping /etc/nginx/modsec/ModSecurity/unicode.mapping && \
    unlink /etc/nginx/sites-enabled/default

# SecRuleEngine On
COPY modsecurity.conf /etc/nginx/modsec/modsecurity.conf
# Includes
COPY main.conf /etc/nginx/modsec/main.conf

COPY nodeapp.conf /etc/nginx/conf.d/default.conf
COPY default.html /var/www/app/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]