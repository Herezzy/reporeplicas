FROM oraclelinux:7-slim

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 12.22.1

# Instala Oracle Instant Client con SQL*Plus y otras herramientas necesarias
RUN yum -y install oracle-release-el7 && \
    yum-config-manager --disable ol7_developer_EPEL && \
    yum -y install oracle-instantclient19.3-basic oracle-instantclient19.3-sqlplus curl && \
    yum -y groupinstall "Development Tools" && \
    rm -rf /var/cache/yum && \
    curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 

RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Confirma la instalación de Node.js
RUN node -v
RUN npm -v

WORKDIR /app

# Instala las dependencias del proyecto
COPY package*.json ./

RUN rm -rf node_modules
RUN npm install -g forever
RUN npm install

# Copia el archivo tnsnames.ora
COPY config/tnsnames.ora /usr/lib/oracle/19.3/client64/lib/network/admin/

EXPOSE 3000

CMD [ "forever", "./src/index.js" ]
