# Base image
FROM ubuntu:latest

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Update and install SSH
RUN apt-get update && apt-get install -y openssh-server

# SSH configuration
RUN mkdir /var/run/sshd
RUN echo 'root:123123' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Expose port for SSH
EXPOSE 22

# Start SSH
CMD ["/usr/sbin/sshd", "-D"]