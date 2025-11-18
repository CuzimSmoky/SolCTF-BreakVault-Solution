# === Solana Dev Container ===
FROM ubuntu:24.04

# Setze Umgebungsvariablen für eine nicht-interaktive Installation
ENV DEBIAN_FRONTEND=noninteractive

# Systempakete und Abhängigkeiten installieren
RUN apt-get update && apt-get install -y \
    curl git build-essential pkg-config libssl-dev libudev-dev \
    python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Solana installieren
RUN curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash

# Solana CLI in PATH einfügen
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Überprüfen, ob Solana funktioniert
RUN solana --version

# Node.js installieren (empfohlen: LTS - 20.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@11.6.2

# Arbeitsverzeichnis erstellen
WORKDIR /workspace

# Container bleibt interaktiv
CMD [ "bash" ]
