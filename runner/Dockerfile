FROM mcr.microsoft.com/dotnet/sdk:6.0.201-bullseye-slim-amd64

# Update and install curl
RUN apt update && \
    apt install -y build-essential curl

# Test
RUN ls -la /usr/share/dotnet/shared/Microsoft.NETCore.App/

# Install rustup
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Start rust app
WORKDIR /usr/src/app

COPY . .

RUN cargo build --release

CMD ["/usr/src/app/target/release/runner"]
