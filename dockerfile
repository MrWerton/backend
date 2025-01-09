# Use uma imagem base do Ubuntu
FROM ubuntu:latest

# Evita perguntas durante a instalação de pacotes
ENV DEBIAN_FRONTEND=noninteractive

# Atualiza os pacotes e instala o servidor SSH
RUN apt-get update && \
    apt-get install -y openssh-server sudo && \
    apt-get clean

# Configura o SSH para aceitar conexões, criando diretórios necessários
RUN mkdir /var/run/sshd

# Adiciona um usuário (ex: user) e define a senha (ex: password)
RUN useradd -rm -d /home/user -s /bin/bash -g root -G sudo -u 1000 user
RUN echo 'user:password' | chpasswd

# Opção para permitir login como root, aqui desabilitado por segurança
# RUN echo 'root:root' | chpasswd
# RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Expose porta para o serviço SSH
EXPOSE 22

# Comando para iniciar o servidor SSH
CMD ["/usr/sbin/sshd", "-D"]
