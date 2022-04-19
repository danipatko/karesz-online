FROM mcr.microsoft.com/dotnet/sdk:6.0.201-bullseye-slim-amd64

# Update and install curl
RUN apt update && \
    apt install -y build-essential curl

# Test
RUN ls -la /usr/share/dotnet/sdk/

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000

# Install rustup
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

RUN mkdir -p /home/testing
COPY ./test.runtimeconfig.json /home/testing/

# Start rust app
WORKDIR /usr/src/app

COPY . .

RUN cargo build --release

EXPOSE 8000

CMD ["/usr/src/app/target/release/runner"]
