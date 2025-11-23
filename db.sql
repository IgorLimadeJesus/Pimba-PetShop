pimbapetpimbapetpimbapet-- Criar banco de dados (opcional)
CREATE DATABASE IF NOT EXISTS pimbapet;
USE pimbapet;

-- Tabela de usuários
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

-- Tabela de donos
CREATE TABLE Dono (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(15)
);

-- Tabela de pets
CREATE TABLE Pet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    dono_id INT,
    FOREIGN KEY (dono_id) REFERENCES Dono(id)
);
