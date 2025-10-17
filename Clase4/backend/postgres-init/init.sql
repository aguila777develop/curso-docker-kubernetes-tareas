-- Verificar si la base de datos existe y, si no, crearla
DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'my_database') THEN
        PERFORM dblink_connect('dbname=postgres');
        EXECUTE 'CREATE DATABASE my_database';
    END IF;
END
$$;

-- Conectar a la base de datos que acabamos de crear
\c my_database;

-- Crear la tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Insertar 5 registros de usuarios
INSERT INTO users (name, email) VALUES
('Juan Perez', 'juan@example.com'),
('Maria Lopez', 'maria@example.com'),
('Carlos García', 'carlos@example.com'),
('Ana Fernández', 'ana@example.com'),
('Pedro Sánchez', 'pedro@example.com');
